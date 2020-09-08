<template>
  <div class="page-js1">
    <div class="container">
      <div
        class="bg-box"
        :style="{
          backgroundImage: 'url(' + coverImgUrl + ')',
          backgroundSize: 'cover',
          zIndex: zIndex,
        }"
        ref="bgRef"
      ></div>
      <div class="city-box">
        <div
          class="city-item "
          :class="'c' + (idx + 1)"
          :key="idx"
          v-for="(item, idx) in exhibitionList"
          @click="handleClick(item, idx)"
        >
          <div v-if="item.isShow">
            <div
              class="bg"
              :style="{
                backgroundImage: 'url(' + item.url + ')',
                backgroundSize: 'cover',
              }"
            ></div>
            <div class="item-title">
              <span>{{ item.name }}</span> <br />
              <span>{{ item.pingyin }}</span> <br />
              <span>{{ item.isBig }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function ImgItem(params) {
  for (const key in params) {
    this[key] = params[key];
  }
}
ImgItem.prototype.toggleBig = function() {
  this.isBig = !this.isBig;
};
ImgItem.prototype.unBig = function() {
  this.isBig = false;
};
ImgItem.prototype.big = function() {
  this.isBig = true;
};
ImgItem.prototype.unShow = function() {
  this.isShow = false;
};
ImgItem.prototype.show = function() {
  this.isShow = true;
};
export default {
  name: '',
  mixins: [],
  props: {},
  components: {},
  filter: {},
  computed: {},
  data() {
    return {
      coverImgUrl: '',
      zIndex: 0,
      exhibitionList: [
        {
          name: '深圳',
          pingyin: 'SHENZHEN',
          address: '深圳·国家会展中心',
          url: './bg/01.jpg',
          desc:
            '公司亦拥有了一批责任心强、综合素质高、业务能力过硬、团结协作的服务团队，并掌握了一套科学的管理模式、服务标准与价格体系，这些都为公司做专做精展馆运营业务提供了有力的保证，也为公司未来的大发展奠定了坚实的基础。',
          service: '广告开发、水电气管理、展馆配电、展馆吊点',
        },
        {
          name: '广州',
          pingyin: 'GUANGZHOU',
          address: '琶洲·广交会展馆',
          url: './bg/02.jpg',
          desc:
            '公司亦拥有了一批责任心强、综合素质高、业务能力过硬、团结协作的服务团队，并掌握了一套科学的管理模式、服务标准与价格体系，这些都为公司做专做精展馆运营业务提供了有力的保证，也为公司未来的大发展奠定了坚实的基础。',
          service: '广告开发、水电气管理、展馆配电、展馆吊点',
        },
        {
          name: '天津',
          pingyin: 'TIANJIN',
          address: '天津·国家会展中心',
          url: './bg/01.jpg',
          desc:
            '公司亦拥有了一批责任心强、综合素质高、业务能力过硬、团结协作的服务团队，并掌握了一套科学的管理模式、服务标准与价格体系，这些都为公司做专做精展馆运营业务提供了有力的保证，也为公司未来的大发展奠定了坚实的基础。',
          service: '国家会展中心 （天津） 运营管理',
        },
        {
          name: '上海',
          pingyin: 'SHANGHAI',
          address: '上海·国家会展中心',
          url: './bg/02.jpg',
          desc:
            '公司亦拥有了一批责任心强、综合素质高、业务能力过硬、团结协作的服务团队，并掌握了一套科学的管理模式、服务标准与价格体系，这些都为公司做专做精展馆运营业务提供了有力的保证，也为公司未来的大发展奠定了坚实的基础。',
          service: '广告开发、水电气管理、展馆配电、展馆吊点',
        },
      ],
      currentObj: null,
    };
  },
  watch: {},
  // life cycle start
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    let temp = [];
    this.exhibitionList.forEach((x) => {
      x.isBig = false;
      x.isShow = true;
      temp.push(new ImgItem(x));
    });
    this.exhibitionList = temp;
    console.log(this.exhibitionList, 77);
  },
  beforeDestroy() {},
  destroyed() {},
  // life cycle end
  methods: {
    handleClick(item, idx) {
      if (!this.currentObj) {
        this.currentObj = item;
        this.currentIdx = idx;
        this.exhibitionList.forEach((x, i) => {
          if (i != idx) {
            // 要变大
            x.unShow();
          }
        });

        this.coverImgUrl = item.url;
        item.toggleBig();
      } else {
        this.exhibitionList.forEach((x, i) => {
          if (i != this.currentIdx) {
            // 要还原
            x.show();
          }
        });
        this.coverImgUrl = '';
        this.currentObj.toggleBig();
        this.currentObj = null;
        this.currentIdx = 0;
      }
    },
  },
};
</script>

<style lang="scss">
.page-js1 {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}
.bg-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.container {
  height: 60%;
  position: relative;
}
.city-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: calc(90vw + 16px);
  height: 100%;
  justify-content: space-around;
  .city-item {
    position: relative;
    flex: 1;
    margin: 0 8px;
    overflow: hidden;
    .item-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      font-weight: 400;
      color: #fff;
    }
  }
  .bg {
    position: absolute;
    width: 100vw;
    height: 100%;
  }
  .c1 {
    .bg {
      background-size: cover;
      top: 0;
      left: calc(10vw - 15vw);
    }
  }
  .c2 {
    .bg {
      background-size: cover;
      left: calc(10vw - 15vw - 90vw / 4 - 8px / 2);
    }
  }
  .c3 {
    .bg {
      background-size: cover;
      left: calc(10vw - 15vw - 90vw / 4 * 2 - 8px / 2 * 2);
    }
  }
  .c4 {
    .bg {
      background-size: cover;
      left: calc(10vw - 15vw - 90vw / 4 * 3 - 8px / 2 * 3);
    }
  }
}
</style>
