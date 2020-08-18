export default {
  data() {
    return {
      userInfo: null
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = {
        name: "louiebb",
        gender: "male"
      };
    }
  },
  created() {
    this.getUserInfo();
  }
};
