
const jwt = require('jsonwebtoken')

export default {
  data: function () {
    return {
      userData: {}
    }
  },
  mounted() {
    const token = localStorage.getItem('jwt')
    const decoded = jwt.decode(token)
    this.userData = {
      id: decoded.sub,
      role: decoded.role
    }
  },
  computed: {
    isAdmin() {
      return this.userData.role === 1
    },
    isArb() {
      return this.userData.role === 2
    }
  }
}
