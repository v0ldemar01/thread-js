import PropTypes from 'prop-types';
import {
  PostPayloadKey,
  ButtonColor,
  ButtonType,
  IconName
} from 'common/enums/enums';
import { postType } from 'common/prop-types/prop-types';
import {
  Button,
  Input,
  Image,
  Message,
  Segment
} from 'components/common/common';
import { useState, useCallback, useAppForm } from 'hooks/hooks.js';
import { DEFAULT_UPDATE_POST_PAYLOAD } from './common/constants.js';

import styles from './styles.module.scss';

const UpdatePost = ({
  post,
  onClose,
  onPostUpdate,
  onUploadImage
}) => {
  const [image, setImage] = useState(post.image);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: Object.fromEntries(
      Object.keys(DEFAULT_UPDATE_POST_PAYLOAD).map(key => ([
        key,
        post[key]
      ]))
    )
  });

  const handleClose = useCallback(
    () => {
      reset();
      onClose();
      setImage(undefined);
    },
    [reset, onClose]
  );

  const handleUpdatePost = useCallback(
    values => {
      const hasNotChanged = post.body === values.body && post.image === image;
      if (!values.body || hasNotChanged) {
        return;
      }

      onPostUpdate({
        ...post,
        imageId: image?.id ?? null,
        body: values.body
      }).then(() => handleClose());
    },
    [image, post, handleClose, onPostUpdate]
  );

  const handleUploadFile = ({ target }) => {
    setIsUploading(true);
    const [file] = target.files;

    onUploadImage(file)
      .then(({ id, link }) => {
        setImage({ id, link });
      })
      .catch(() => {
        setErrorMessage('Error while uploading image');
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <Segment>
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        {Boolean(errorMessage) && (
          <Message>
            <p>{errorMessage}</p>
          </Message>
        )}

        <Input
          name={PostPayloadKey.BODY}
          placeholder="New post description"
          rows={5}
          control={control}
        />
        {image?.link && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={image?.link} alt="post_img" />
          </div>
        )}
        <div className={styles.btnWrapper}>
          {image?.link && (
            <Button
              color={ButtonColor.RED}
              isLoading={isUploading}
              isDisabled={isUploading}
              iconName={IconName.IMAGE}
              onClick={() => setImage(null)}
            >
              <label className={styles.btnImgLabel}>Delete image</label>
            </Button>
          )}
          <Button
            color="teal"
            isLoading={isUploading}
            isDisabled={isUploading}
            iconName={IconName.IMAGE}
          >
            <label className={styles.btnImgLabel}>
              Attach image
              <input
                name="image"
                type="file"
                onChange={handleUploadFile}
                hidden
              />
            </label>
          </Button>
          <div className={styles.buttons}>
            <Button
              isLoading={isUploading}
              isDisabled={isUploading}
              color={ButtonColor.RED}
              type={ButtonType.BUTTON}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              isLoading={isUploading}
              isDisabled={isUploading}
              color={ButtonColor.TEAL}
              type={ButtonType.SUBMIT}
            >
              Update
            </Button>
          </div>
        </div>

      </form>
    </Segment>
  );
};

UpdatePost.propTypes = {
  post: postType.isRequired,
  onPostUpdate: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export { UpdatePost };
