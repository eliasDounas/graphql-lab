function posts(parent, args, context) {
  return context.prisma.tag
    .findUnique({ where: { id: parent.id } })
    .posts()
}

module.exports = {
  posts,
}
