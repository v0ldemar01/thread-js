
import PropTypes from 'prop-types';
import { commentType } from 'common/prop-types/prop-types';
import { useAppForm, useCallback } from 'hooks/hooks.js';
import { ButtonType, CommentPayloadKey } from 'common/enums/enums.js';
import { Button, Input, Segment } from 'components/common/common.js';
import { DEFAULT_UPDATE_COMMENT_PAYLOAD } from './common/constants.js';

const UpdateComment = ({ comment, onClose, onCommentUpdate }) => {
  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: Object.fromEntries(
      Object.keys(DEFAULT_UPDATE_COMMENT_PAYLOAD).map(key => ([
        key,
        comment[key]
      ]))
    )
  });

  const handleClose = useCallback(
    () => {
      reset();
      onClose();
    },
    [reset, onClose]
  );

  const handleUpdateComment = useCallback(
    values => {
      if (!values.body || comment.body === values.body) {
        return;
      }

      onCommentUpdate({ ...comment, body: values.body }).then(() => handleClose());
    },
    [comment, handleClose, onCommentUpdate]
  );

  return (
    <Segment>
      <form name="comment" onSubmit={handleSubmit(handleUpdateComment)}>
        <Input
          name={CommentPayloadKey.BODY}
          placeholder="Update a comment..."
          rows={5}
          control={control}
        />
        <Button type={ButtonType.SUBMIT} isPrimary>
          Update comment
        </Button>
      </form>
    </Segment>
  );
};

UpdateComment.propTypes = {
  comment: commentType.isRequired,
  onClose: PropTypes.func.isRequired,
  onCommentUpdate: PropTypes.func.isRequired
};

export { UpdateComment };
