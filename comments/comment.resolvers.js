export default {
  Comment: {
    isMe: ({ userId }, _, { loggedInUser }) => (loggedInUser ? loggedInUser.id === userId : false),
  },
};
