const User = require('../schema/user.schema');
const Post = require('../schema/post.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
    const users = await User.find();
    // console.log(users);

    const userWithTheirNumofPosts = await Promise.all(
      users.map(async user => {
        const posts = await Post.find({ userId: user._id });
        return {
          _id: user.id,
          name: user.name,
          posts: posts.length,
        };
      })
    );
    // console.log(userWithTheirNumofPosts);

    //server side pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const totalPages = Math.ceil(userWithTheirNumofPosts.length / limit);
    const pagingCount = Math.ceil(totalPages / 10);
    const hasPrevPage = page > 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    const hasNextPage = page < totalPages;
    const nextPage = page + 1;
    const totalDocs = await Post.countDocuments();

    const pagination = {
      totalDocs,
      limit,
      page,
      totalPages,
      pagingCount,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };

    const result = res.status(200).json({
      data: {
        users: userWithTheirNumofPosts,
        pagination,
      },
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
