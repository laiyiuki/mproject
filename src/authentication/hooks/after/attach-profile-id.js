module.exports = function attachOrGenerateProfile() {
  return async context => {
    const { platform } = context.data;
    const { profile } = context.params;
    console.log('attaching profileId to params.user', profile);
    if (platform === 'teacher' && profile && profile._id) {
      context.params.user.teacherId = profile._id;
    }

    if (platform === 'student' && profile && profile._id) {
      context.params.user.studentId = profile._id;
    }

    return context;
  };
};
