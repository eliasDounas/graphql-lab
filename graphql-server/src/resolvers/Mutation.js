async function createUser(_parent, args, context) {
  try {
    const { title, firstName, lastName, gender, email, dateOfBirth, phone, picture, location } = args.input;

    // Validate required fields
    if (!title || !firstName || !lastName || !email || !dateOfBirth || !phone || !picture || !location) {
      throw new Error("VALIDATION_ERROR: All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("VALIDATION_ERROR: Invalid email format");
    }

    // Validate date of birth format
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new Error("VALIDATION_ERROR: Invalid date format");
    }

    // Check for duplicate email
    const existingUser = await context.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("DUPLICATE_ERROR: Email already exists");
    }

    // Create location first
    const createdLocation = await context.prisma.location.create({
      data: {
        street: location.street,
        city: location.city,
        state: location.state,
        country: location.country,
        timezone: location.timezone,
      },
    });

    // Create user
    const newUser = await context.prisma.user.create({
      data: {
        title,
        firstName,
        lastName,
        gender,
        email,
        dateOfBirth: dob,
        phone,
        picture,
        locationId: createdLocation.id,
      },
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
    });

    return newUser;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("DUPLICATE_ERROR: Email already exists");
    }
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}

async function updateUser(_parent, args, context) {
  try {
    const { id, input } = args;
    const { title, firstName, lastName, gender, dateOfBirth, phone, picture, location } = input;

    const existingUser = await context.prisma.user.findUnique({
      where: { id: args.id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (input.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        throw new Error("VALIDATION_ERROR: Invalid email format");
      }
    }

    // Validate date of birth format if it's being updated
    let dob;
    if (dateOfBirth) {
      dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        throw new Error("VALIDATION_ERROR: Invalid date format");
      }
    }

    // Update location if provided
    let updatedLocation = null;
if (location) {
  updatedLocation = await context.prisma.location.create({
    data: {
      street: location.street,
      city: location.city,
      state: location.state,
      country: location.country,
      timezone: location.timezone,
    },
  });
}


    // Update user
    const updatedUser = await context.prisma.user.update({
      where: { id },
      data: {
        title,
        firstName,
        lastName,
        gender,
        dateOfBirth: dob,
        phone,
        picture,
        locationId: updatedLocation ? updatedLocation.id : undefined,
      },
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
    });

    return updatedUser;
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("NOT_FOUND_ERROR: User not found");
    }
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}
  
async function deleteUser(_parent, { id }, context){
  try {
    // Delete the user from the database
    const deletedUser = await context.prisma.user.delete({
      where: { id },
    });
    return deletedUser.id;
  } catch (error) {
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}

//post mutations
async function createPost(_parent, args, context) {
  try {
    const { text, image, tags, owner, link, likes } = args.input;

    // Validate required fields
    if (!text || !tags || !owner) {
      throw new Error("VALIDATION_ERROR: All fields are required");
    }

    // Validate owner exists
    const existingUser = await context.prisma.user.findUnique({
      where: { id: owner },
    });

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND: Owner does not exist");
    }

    // Ensure tags are created or connected using a transaction
    const tagConnections = await context.prisma.$transaction(
      tags.map((tag) =>
        context.prisma.tag.upsert({
          where: { name: tag },
          update: {}, // No update needed
          create: { name: tag },
        })
      )
    );

    // Create post
    const newPost = await context.prisma.post.create({
      data: {
        text,
        image,
        likes,
        tags: {
          connect: tagConnections.map((tag) => ({ id: tag.id })), // Connect tags
        },
        link,
        owner: { connect: { id: owner } },
      },
      select: {
        id: true,
        text: true,
        image: true,
        likes: true,
        link: true,
        tags: {
          select: {
            name: true,
          },
        },
        publishDate: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    
    return newPost;
  } catch (error) {
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}




// post mutations
async function updatePost(_parent, args, context) {
  try {
    const { id, input } = args;
    const { text, image, likes, tags, link } = input;

    // Validate required fields
    if (!id) {
      throw new Error("VALIDATION_ERROR: Post ID is required");
    }

    // Check if the post exists
    const existingPost = await context.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error("POST_NOT_FOUND: The post does not exist");
    }

    // Ensure tags are connected or created
    let tagConnections = [];
    if (tags && tags.length > 0) {
      tagConnections = await Promise.all(
        tags.map(async (tag) => {
          return context.prisma.tag.upsert({
            where: { name: tag },
            update: {}, // No update needed
            create: { name: tag }, // Create the tag if it doesn't exist
          });
        })
      );
    }

    // Update post
    const updatedPost = await context.prisma.post.update({
      where: { id },
      data: {
        text,
        image,
        likes,
        link,
        tags: {
          connect: tagConnections.map((tag) => ({ id: tag.id })), // Connect the tags to the post
        },
      },
      select: {
        id: true,
        text: true,
        image: true,
        likes: true,
        link: true,
        tags: {
          select: {
            name: true,
          },
        },
        publishDate: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedPost;
  } catch (error) {
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}

async function deletePost(_parent, args, context) {
  try {
    const { id } = args;

    // Check if the post exists before deleting
    const existingPost = await context.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error("POST_NOT_FOUND: The post does not exist");
    }

    // Delete the post
    await context.prisma.post.delete({
      where: { id },
    });

    // Return the id of the deleted post
    return id;
  } catch (error) {
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}
 
//comments mutations
async function createComment(_parent, args, context) {
  try {
    const { message, owner, post } = args.input;

    // Validate required fields
    if (!message || !owner || !post) {
      throw new Error("VALIDATION_ERROR: All fields are required");
    }

    // Ensure the owner (user) exists
    const existingUser = await context.prisma.user.findUnique({
      where: { id: owner },
    });

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND: Owner does not exist");
    }

    // Ensure the post exists
    const existingPost = await context.prisma.post.findUnique({
      where: { id: post },
    });

    if (!existingPost) {
      throw new Error("POST_NOT_FOUND: The post does not exist");
    }

    // Create the comment
    const newComment = await context.prisma.comment.create({
      data: {
        message,
        owner: { connect: { id: owner } },
        post: { connect: { id: post } },
      },
      select: {
        id: true,
        message: true,
        publishDate: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        postId: true,
      },
    });

    return newComment;
  } catch (error) {
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}

async function deleteComment(_parent, args, context) {
  try {
    const { id } = args;

    // Ensure the comment exists
    const existingComment = await context.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new Error("COMMENT_NOT_FOUND: Comment does not exist");
    }

    // Delete the comment
    await context.prisma.comment.delete({
      where: { id },
    });

    return id; // Return the deleted comment's ID
  } catch (error) {
    throw new Error(`SERVER_ERROR: ${error.message}`);
  }
}

  module.exports = {
    createUser,
    updateUser,
    deleteUser,
    createPost,
    updatePost,
    deletePost,
    createComment,
    deleteComment,
  }
  