//user queries
async function users(_parent, args, context) {

  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { registerDate: args.orderBy ?? "desc" }
  const total = await context.prisma.user.count()
  const users = await context.prisma.user.findMany({
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      title: true,
      firstName: true,
      lastName: true,
      picture: true,
    },
  })

  return {
    data: users,
    total,
    page,
    limit,
  }
}

async function user(_parent, args, context) {
  return context.prisma.user.findUnique({
    where: { id: args.id },
    select: {
      id: true,
      title: true,
      firstName: true,
      lastName: true,
      gender: true,
      email: true,
      dateOfBirth: true,
      registerDate: true,
      phone: true,
      picture: true,
      location: {
        select: {
          street: true,
          city: true,
          state: true,
          country: true,
          timezone: true,
        },
      },
    },
  })
}

  
//post queries
async function posts(_parent, args, context) {

  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { publishDate: args.orderBy ?? "desc" }
  const total = await context.prisma.post.count()
  const posts = await context.prisma.post.findMany({
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      text: true,
      image: true,
      likes: true,
      publishDate: true,
      tags: {
        select: {
          name: true,
        },
      },
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  // Transform the tags into a list of strings
  const formattedPosts = posts.map(post => ({
    ...post,
    tags: post.tags.map(tag => tag.name), // Convert [{ name: "tag1" }] -> ["tag1"]
  }))


  return {
    data: formattedPosts,
    total,
    page,
    limit,
  }
}
async function postsByUser(_parent, args, context) {

  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { publishDate: args.orderBy ?? "desc" }
  const total = await context.prisma.post.count({
    where: { ownerId: args.userId }
  })

  const posts = await context.prisma.post.findMany({
    where: {ownerId: args.userId},
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      text: true,
      image: true,
      likes: true,
      publishDate: true,
      tags: {
        select: {
          name: true,
        },
      },
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  // Transform the tags into a list of strings
  const formattedPosts = posts.map(post => ({
    ...post,
    tags: post.tags.map(tag => tag.name),
  }))


  return {
    data: formattedPosts,
    total,
    page,
    limit,
  }
}

async function postsByTag(_parent, args, context) {
  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { publishDate: args.orderBy ?? "desc" }
  // Count the total posts related to the tag using the many-to-many relationship
  const total = await context.prisma.post.count({
    where: {
      tags: {
        some: {
          name: args.tag, // Filter by the provided tag name
        },
      },
    },
  })

 
  const posts = await context.prisma.post.findMany({
    where: {
      tags: {
        some: {
          name: args.tag, // Filter by the provided tag name
        },
      },
    },
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      text: true,
      image: true,
      likes: true,
      publishDate: true,
      tags: {
        select: {
          name: true,
        },
      },
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  // Format the tags into a list of strings
  const formattedPosts = posts.map(post => ({
    ...post,
    tags: post.tags.map(tag => tag.name),
  }))

  return {
    data: formattedPosts,
    total,
    page,
    limit,
  }
}

async function postById(_parent, args, context) {

  const post = await context.prisma.post.findUnique({
    where: {id: args.id},
    select: {
      id: true,
      text: true,
      image: true,
      likes: true,
      link: true,
      publishDate: true,
      tags: {
        select: {
          name: true,
        },
      },
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  if (!post) {
    throw new Error('Post not found');
  }

  // Transform the tags into a list of strings
  const formattedPost = {
    ...post,
    tags: post.tags.map(tag => tag.name),
  }


  return formattedPost
}


//comment queries
async function comments(_parent, args, context) {

  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { publishDate: args.orderBy ?? "desc" }
  const total = await context.prisma.comment.count()

  const comments = await context.prisma.comment.findMany({
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      message: true,
      publishDate: true,
      postId: true,
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  return {
    data: comments,
    total,
    page,
    limit,
  }
}

//we choose to query from the comments model because it minimizes data retrieval by directly filtering and paginating the comments.
async function commentsByPost(_parent, args, context) {

  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { publishDate: args.orderBy ?? "desc" }
  const total = await context.prisma.comment.count({
    where: { postId: args.postId },
  });

  const comments = await context.prisma.comment.findMany({
    where: { postId: args.postId},
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      message: true,
      publishDate: true,
      postId: true,
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  return {
    data: comments,
    total,
    page,
    limit,
  }
}

async function commentsByUser(_parent, args, context) {

  const page = args.page ?? 1
  const limit = args.limit ?? 10
  const skip = (page - 1) * limit
  const orderBy = { publishDate: args.orderBy ?? "desc" }
  const total = await context.prisma.comment.count({
    where: { ownerId: args.userId },
  });

  const comments = await context.prisma.comment.findMany({
    where: { ownerId: args.userId},
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      message: true,
      publishDate: true,
      postId: true,
      owner: {
        select: {
          id: true,
          title: true,
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
    },
  })

  return {
    data: comments,
    total,
    page,
    limit,
  }
}

//tag queries
async function tags(_parent, args, context) {

  const tags = await context.prisma.tag.findMany({
    select: {
      name: true,
    }
  })

  const tagNames = tags.map(tag => tag.name);

  return tagNames;
}

module.exports = {
  users,
  user,
  posts,
  postsByTag,
  postsByUser,
  postById,
  comments,
  commentsByPost,
  commentsByUser,
  tags
}