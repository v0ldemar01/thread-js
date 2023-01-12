import { useAppForm, useSelector, useDispatch, useCallback } from 'hooks/hooks';
import { Image, Input, ImageCrop, Button, Message } from 'components/common/common';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants';
import { ImageSize, IconName, ButtonColor, ButtonType } from 'common/enums/enums';
import { useRef, useState } from 'hooks/hooks.js';
import { profileActionCreator } from 'store/actions.js';
import { AvatarPreview } from './components/components.js';
import {
  ALLOWED_FILE_TYPES,
  DEFAULT_USER_PAYLOAD
} from './common/constants.js';
import styles from './styles.module.scss';

const Profile = () => {
  const [image, setImage] = useState(null);
  const [isShownAvatarPreview, setShownAvatarPreview] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const imageRef = useRef();
  const previewCanvasRef = useRef(null);

  const dispatch = useDispatch();

  const { user } = useSelector(state => ({
    user: state.profile.user
  }));

  const { control, isDirty, reset, handleSubmit } = useAppForm({
    defaultValues: Object.fromEntries(
      Object.keys(DEFAULT_USER_PAYLOAD).map(key => ([
        key,
        user[key]
      ]))
    )
  });

  const handleAvatarClick = () => {
    imageRef.current.click();
  };

  const handleUploadImage = useCallback(({ target }) => {
    const [file] = target.files;
    if (file) {
      const imageReader = new FileReader();
      imageReader.readAsDataURL(file);
      imageReader.onloadend = () => {
        setImage(imageReader.result);
      };
    }
  }, []);

  const handleCancelUpload = () => {
    setImage(null);
    setShownAvatarPreview(false);
  };

  const handleUpdateAvatar = useCallback(() => {
    setUploading(true);

    dispatch(profileActionCreator.updateUserAvatar(
      previewCanvasRef.current.toDataURL()
    ))
      .unwrap()
      .catch(() => {
        setErrorMessage('Error while uploading image');
      })
      .finally(() => {
        setUploading(false);
        handleCancelUpload();
      });
  }, [dispatch]);

  const handleUpdateProfile = useCallback(values => {
    dispatch(profileActionCreator.updateUser(
      values
    ))
      .unwrap()
      .finally(() => reset(user, { keepValues: true }));
  }, [user, dispatch, reset]);

  return (
    <form
      name="profile"
      className={styles.profile}
      onSubmit={handleSubmit(handleUpdateProfile)}
    >
      {!image && (
        <Button isBasic onClick={handleAvatarClick}>
          <Image
            alt="profile avatar"
            isCentered
            src={user.image?.link ?? DEFAULT_USER_AVATAR}
            size={ImageSize.MEDIUM}
            isCircular
          />
        </Button>
      )}
      {isShownAvatarPreview && (
        <AvatarPreview
          ref={previewCanvasRef}
        />
      )}
      <input
        hidden
        type="file"
        ref={imageRef}
        name="profile-image"
        accept={ALLOWED_FILE_TYPES}
        onChange={handleUploadImage}
      />
      <div className={styles.cropContainer}>
        <ImageCrop
          image={image}
          isExternalPreview
          ref={previewCanvasRef}
          onCompleteCrop={crop => setShownAvatarPreview(
            Boolean(crop.width && crop.height)
          )}
        />
      </div>
      {Boolean(image) && (
        <div className={styles.actions}>
          <Button
            type={ButtonType.BUTTON}
            onClick={handleCancelUpload}
          >
            Cancel
          </Button>
          <Button
            color={ButtonColor.TEAL}
            type={ButtonType.BUTTON}
            isLoading={isUploading}
            isDisabled={isUploading || !isShownAvatarPreview}
            onClick={handleUpdateAvatar}
          >
            Update avatar
          </Button>
        </div>
      )}
      {Boolean(errorMessage) && (
        <Message>
          <p>{errorMessage}</p>
        </Message>
      )}
      <fieldset className={styles.fieldset}>
        <Input
          iconName={IconName.USER}
          placeholder="Username"
          name="username"
          // value={user.username} // !
          control={control}
        />
        <Input
          disabled
          name="email"
          type="email"
          control={control}
          // value={user.email} // !
          placeholder="Email"
          iconName={IconName.AT}
        />
        <Input
          name="status"
          control={control}
          // value={user.email} // !
          placeholder="Status"
        />
      </fieldset>
      {isDirty && (
        <div className={styles.actions}>
          <Button
            type={ButtonType.BUTTON}
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button
            color={ButtonColor.TEAL}
            type={ButtonType.SUBMIT}
          >
            Update profile
          </Button>
        </div>
      )}
    </form>
  );
};

export { Profile };
