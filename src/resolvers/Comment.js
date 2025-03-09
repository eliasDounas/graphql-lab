function owner(parent, args, context) {
    return context.prisma.comment
      .findUnique({ where: { id: parent.id } })
      .owner()
  }
  
  function post(parent, args, context) {
    return context.prisma.comment
      .findUnique({ where: { id: parent.id } })
      .post()
  }
  
  module.exports = {
    owner,
    post,
  }
  