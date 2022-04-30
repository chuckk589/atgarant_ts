<script>
export default {
  name: 'nav',
  computed: {
    sidebarItems() {
      let items = [
        {
          _name: 'CSidebarNav',
          _children: [
            {
              _name: 'CSidebarNavItem',
              name: 'Сделки',
              to: '/offers',
              icon: 'cil-briefcase'
            },
            {
              _name: 'CSidebarNavItem',
              name: 'Арбитражи',
              to: '/arbitrary',
              icon: 'cil-balance-scale'
            }
          ]
        }
      ]
      if(this.isAdmin){
        items[0]._children.push({
          _name: 'CSidebarNavItem',
          name: 'Пользователи',
          to: '/users',
          icon: 'cil-people'
        })
      }
      return items
    }
  }
}
</script>
