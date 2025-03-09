function owner(parent, args, context) {
    return context.prisma.post
      .findUnique({ where: { id: parent.id } })
      .owner()
  }
  
  function tags(parent, args, context) {
    return context.prisma.post
      .findUnique({ where: { id: parent.id } })
      .tags()
  }
  
  function comments(parent, args, context) {
    return context.prisma.post
      .findUnique({ where: { id: parent.id } })
      .comments()
  }
  
  module.exports = {
    owner,
    tags,
    comments,
  }
  