function posts(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .posts()
}

function comments(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .comments()
}

function location(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .location()
}

module.exports = {
  posts,
  comments,
  location,
}
