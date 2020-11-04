const app = new Vue({
  el: "#wrap",
  data() {
    return {
      count:{
        num: 3
      },
      side: 80,
      blocks: [],
      contentRotate: {
        x: -30,
        y: 30
      },
      controlBgColor:{
        view0: "rgb(204, 102, 153)",
        view1: "rgb(204, 102, 153)",
        view2: "rgb(204, 102, 153)",
      },
      transition: 0, //动画时间初始化为零
    }
  },
  created() {
    this.getBlocks()
    // 添加键盘事件
    document.onkeydown = (e) => {
      switch (e.keyCode) {
        case 37:
          this.contentRotate.y -= 10;
          break;
        case 38:
          this.contentRotate.x += 10;
          break;
        case 39:
          this.contentRotate.y += 10;
          break;
        case 40:
          this.contentRotate.x -= 10;
          break;
        default:
          break;
      }
    }
  },
  methods: {
    resetRubit() {
      window.location.reload()
    },
    behindView() {
      this.contentRotate.x = 0
      this.contentRotate.y = 180
      this.controlBgColor.view0 = "rgb(204, 51, 51)"
    },
    leaveBehindView() {
      this.contentRotate.x = -30
      this.contentRotate.y = 30
      this.controlBgColor.view0 = "rgb(204, 102, 153)"
    },
    rightView() {
      this.contentRotate.x = 0
      this.contentRotate.y = -90
      this.controlBgColor.view1 = "rgb(204, 51, 51)"
    },
    leaveRightView() {
      this.contentRotate.x = -30
      this.contentRotate.y = 30
      this.controlBgColor.view1 = "rgb(204, 102, 153)"
    },
    bottomView() {
      this.contentRotate.x = 90
      this.controlBgColor.view2 = "rgb(204, 51, 51)"
    },
    leaveBottomView() {
      this.contentRotate.x = -30
      this.controlBgColor.view2 = "rgb(204, 102, 153)"
    },
    
    touchStart(e, area, block) {
      // console.log(e.touches[0], area, block)
      const touchStartX = e.touches[0].pageX
      const touchStartY = e.touches[0].pageY
      const x = block.x
      const y = block.y
      const z = block.z
      const documentWidth = window.screen.availWidth
      const documentHeight = window.screen.availHeight
      document.ontouchend = (e) => {
        console.log(e.changedTouches)
        this.transition = 0.5
        const touchEndX = e.changedTouches[0].pageX
        const touchEndY = e.changedTouches[0].pageY
        const deltayX = touchEndX - touchStartX
        const deltayY = touchEndY - touchStartY
        // 防止误触
        if(Math.abs(deltayX) < 0.1*documentWidth && Math.abs(deltayY) < 0.05*documentHeight){
        return
      }
      if (Math.abs(deltayX) > Math.abs(deltayY)) {
          // 左右拖动、沿y轴转动
          if (deltayX > 0) {
            if (area.direct === "front" || area.direct === "behind" || area.direct === "left" || area.direct === "right") {
              // 向右滑动
              console.log("向右")
              this.rotatey(x, y, z)
            } else if (area.direct === "bottom") {
              this.rotatez_reverse(x, y, z)
            } else {
              this.rotatez(x, y, z)
            }
          } else {
            if (area.direct === "front" || area.direct === "behind" || area.direct === "left" || area.direct === "right") {
              // 向左拖动
              console.log("向左")
              this.rotatey_reverse(x, y, z)
            } else if (area.direct === "bottom") {
              this.rotatez(x, y, z)
            } else {
              // 沿z轴转动
              this.rotatez_reverse(x, y, z)
            }
          }
        } else {
          // 上下拖动、沿x轴转动

          if (deltayY > 0) {
            // 鼠标向下拖动
            if (area.direct === "front" || area.direct === "top" || area.direct === "bottom") {
              this.rotatex(x, y, z)
            } else if (area.direct === "right") {
              this.rotatez(x, y, z)
            } else if (area.direct === "behind") {
              this.rotatex_reverse(x, y, z)
            }
            else {
              this.rotatez_reverse(x, y, z)
            }

          } else {
            // 鼠标向上拖动
            if (area.direct === "front" || area.direct === "top" || area.direct === "bottom") {

              this.rotatex_reverse(x, y, z)
            } else if (area.direct === "behind") {
              this.rotatex(x, y, z)
            }
            else if (area.direct === "right") {
              this.rotatez_reverse(x, y, z)
            } else {
              this.rotatez(x, y, z)
            }
          }
        }
        // 重置触摸事件
        document.ontouchend = null
      }
    },
    touchMove(e) {
      e.preventDefault()
    },
    rotatex(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].x === x) {
          // 更新坐标、沿x轴转动 x坐标不变，只改变y和z坐标
          this.blocks[i].rotate.x -= 90
          setTimeout(() => {
            this.transition = 0
            const oldy = this.blocks[i].y
            const oldz = this.blocks[i].z
            this.blocks[i].z = oldy
            this.blocks[i].y = this.count.num - 1 - oldz
            this.blocks[i].rotate.x = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "top") {
                this.blocks[i].areas[j].direct = "front"
              }
              else if (this.blocks[i].areas[j].direct === "front") {
                this.blocks[i].areas[j].direct = "bottom"
              }
              else if (this.blocks[i].areas[j].direct === "bottom") {
                this.blocks[i].areas[j].direct = "behind"
              }
              else if (this.blocks[i].areas[j].direct === "behind")
                this.blocks[i].areas[j].direct = "top"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }
    },
    touchMove(e) {
      e.preventDefault()
    },
    down(e, area, block) {
      // 禁用右键
      // console.log(block)
      if (e.which != 1) {
        return
      }
      // 鼠标拉动元素本身会产生一个默认事件
      e.preventDefault()
      const x = block.x
      const y = block.y
      const z = block.z
      // console.log(e, area)
      const startX = e.pageX || e.clientX
      const startY = e.pageY || e.clientY
      // 获取窗口宽、高度
      const documentWidth = window.screen.availWidth
      const documentHeight = window.screen.availHeight
      // 绑定鼠标松开事件
      document.onmouseup = (e) => {
        this.transition = 0.5
        // console.log(this.blocks)
        const endX = e.pageX || e.clientX
        const endY = e.pageY || e.clientY
        const deltaX = endX - startX
        const deltaY = endY - startY
        // 判断鼠标拖动距离，如果小于屏幕宽高度、防止点击魔方即发生转动
        if (Math.abs(deltaX) < 0.03 * documentWidth && Math.abs(deltaY) < 0.05 * documentHeight) {
          return
        }
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 左右拖动、沿y轴转动
          if (deltaX > 0) {
            if (area.direct === "front" || area.direct === "behind" || area.direct === "left" || area.direct === "right") {
              // 鼠标向右拖动
              this.rotatey(x, y, z)
            } else if (area.direct === "bottom") {
              this.rotatez_reverse(x, y, z)
            } else {
              this.rotatez(x, y, z)
            }
          } else {
            if (area.direct === "front" || area.direct === "behind" || area.direct === "left" || area.direct === "right") {
              // 向左拖动
              this.rotatey_reverse(x, y, z)
            } else if (area.direct === "bottom") {
              this.rotatez(x, y, z)
            } else {
              // 沿z轴转动
              this.rotatez_reverse(x, y, z)
            }
          }
        } else {
          // 上下拖动、沿x轴转动

          if (deltaY > 0) {
            // 鼠标向下拖动
            if (area.direct === "front" || area.direct === "top" || area.direct === "bottom") {
              this.rotatex(x, y, z)
            } else if (area.direct === "right") {
              this.rotatez(x, y, z)
            } else if (area.direct === "behind") {
              this.rotatex_reverse(x, y, z)
            }
            else {
              this.rotatez_reverse(x, y, z)
            }

          } else {
            // 鼠标向上拖动
            if (area.direct === "front" || area.direct === "top" || area.direct === "bottom") {

              this.rotatex_reverse(x, y, z)
            } else if (area.direct === "behind") {
              this.rotatex(x, y, z)
            }
            else if (area.direct === "right") {
              this.rotatez_reverse(x, y, z)
            } else {
              this.rotatez(x, y, z)
            }
          }
        }
        // 重置鼠标点击事件
        document.onmouseup = null
      }
    },
    rotatex(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].x === x) {
          // 更新坐标、沿x轴转动 x坐标不变，只改变y和z坐标
          this.blocks[i].rotate.x -= 90
          setTimeout(() => {
            this.transition = 0
            const oldy = this.blocks[i].y
            const oldz = this.blocks[i].z
            this.blocks[i].z = oldy
            this.blocks[i].y = this.count.num - 1 - oldz
            this.blocks[i].rotate.x = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "top") {
                this.blocks[i].areas[j].direct = "front"
              }
              else if (this.blocks[i].areas[j].direct === "front") {
                this.blocks[i].areas[j].direct = "bottom"
              }
              else if (this.blocks[i].areas[j].direct === "bottom") {
                this.blocks[i].areas[j].direct = "behind"
              }
              else if (this.blocks[i].areas[j].direct === "behind")
                this.blocks[i].areas[j].direct = "top"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }

    },
    rotatey(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].y === y) {
          this.blocks[i].rotate.y += 90
          setTimeout(() => {
            this.transition = 0
            const oldx = this.blocks[i].x
            const oldz = this.blocks[i].z
            this.blocks[i].z = oldx
            this.blocks[i].x = this.count.num - 1 - oldz
            this.blocks[i].rotate.y = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "left") {
                this.blocks[i].areas[j].direct = "front"
              }
              else if (this.blocks[i].areas[j].direct === "front") {
                this.blocks[i].areas[j].direct = "right"
              }
              else if (this.blocks[i].areas[j].direct === "right") {
                this.blocks[i].areas[j].direct = "behind"
              }
              else if (this.blocks[i].areas[j].direct === "behind")
                this.blocks[i].areas[j].direct = "left"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }

    },
    rotatez(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].z === z) {
          this.blocks[i].rotate.z += 90
          setTimeout(() => {
            this.transition = 0
            const oldx = this.blocks[i].x
            const oldy = this.blocks[i].y
            this.blocks[i].y = oldx
            this.blocks[i].x = this.count.num - 1 - oldy
            this.blocks[i].rotate.z = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "left") {
                this.blocks[i].areas[j].direct = "top"
              }
              else if (this.blocks[i].areas[j].direct === "top") {
                this.blocks[i].areas[j].direct = "right"
              }
              else if (this.blocks[i].areas[j].direct === "right") {
                this.blocks[i].areas[j].direct = "bottom"
              }
              else if (this.blocks[i].areas[j].direct === "bottom")
                this.blocks[i].areas[j].direct = "left"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }

    },
    rotatez_reverse(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].z === z) {
          this.blocks[i].rotate.z -= 90
          setTimeout(() => {
            this.transition = 0
            const oldx = this.blocks[i].x
            const oldy = this.blocks[i].y
            this.blocks[i].x = oldy
            this.blocks[i].y = this.count.num - 1 - oldx
            this.blocks[i].rotate.z = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "left") {
                this.blocks[i].areas[j].direct = "bottom"
              }
              else if (this.blocks[i].areas[j].direct === "bottom") {
                this.blocks[i].areas[j].direct = "right"
              }
              else if (this.blocks[i].areas[j].direct === "right") {
                this.blocks[i].areas[j].direct = "top"
              }
              else if (this.blocks[i].areas[j].direct === "top")
                this.blocks[i].areas[j].direct = "left"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }

    },
    rotatex_reverse(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].x === x) {
          this.blocks[i].rotate.x += 90
          setTimeout(() => {
            this.transition = 0
            const oldy = this.blocks[i].y
            const oldz = this.blocks[i].z
            this.blocks[i].y = oldz
            this.blocks[i].z = this.count.num - 1 - oldy
            this.blocks[i].rotate.x = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "top") {
                this.blocks[i].areas[j].direct = "behind"
              }
              else if (this.blocks[i].areas[j].direct === "behind") {
                this.blocks[i].areas[j].direct = "bottom"
              }
              else if (this.blocks[i].areas[j].direct === "bottom") {
                this.blocks[i].areas[j].direct = "front"
              }
              else if (this.blocks[i].areas[j].direct === "front")
                this.blocks[i].areas[j].direct = "top"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }

    },
    rotatey_reverse(x, y, z) {
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].y === y) {
          this.blocks[i].rotate.y -= 90
          setTimeout(() => {
            this.transition = 0
            const oldx = this.blocks[i].x
            const oldz = this.blocks[i].z
            this.blocks[i].x = oldz
            this.blocks[i].z = this.count.num - 1 - oldx
            this.blocks[i].rotate.y = 0
            for (let j = 0; j < this.blocks[i].areas.length; j++) {
              if (this.blocks[i].areas[j].direct === "left") {
                this.blocks[i].areas[j].direct = "behind"
              }
              else if (this.blocks[i].areas[j].direct === "behind") {
                this.blocks[i].areas[j].direct = "right"
              }
              else if (this.blocks[i].areas[j].direct === "right") {
                this.blocks[i].areas[j].direct = "front"
              }
              else if (this.blocks[i].areas[j].direct === "front")
                this.blocks[i].areas[j].direct = "left"
              // 改完朝向之后要对动画进行重新计算
              this.blocks[i].areas[j].transform = this.getAreaTransfroms(this.blocks[i].areas[j].direct)
            }
          }, 500)
        }
      }

    },
    getBlocks() {
      for (let x = 0; x < this.count.num; x++) {
        for (let y = 0; y < this.count.num; y++) {
          for (let z = 0; z < this.count.num; z++) {
            const block = {
              x,
              y,
              z,
              // 块的初始化旋转角度
              rotate: {
                x: 0,
                y: 0,
                z: 0
              },
              areas: this.getAreas(x, y, z)
            }
            this.blocks.push(block)
          }
        }
      }
    },
    getAreas(x, y, z) {
      const areas = [];
      if (x === 0)
        areas.push(this.getArea("left", x, y, z))
        areas.push(this.getArea("right", x, y, z))
      if (x === this.count.num - 1)
        areas.push(this.getArea('right', x, y, z))
        areas.push(this.getArea('left', x, y, z))
      if (y === 0)
        areas.push(this.getArea("top", x, y, z))
        areas.push(this.getArea("bottom", x, y, z))
      if (y === this.count.num - 1)
        areas.push(this.getArea('bottom', x, y, z))
        areas.push(this.getArea('top', x, y, z))
      if (z === 0)
        areas.push(this.getArea("front", x, y, z))
        areas.push(this.getArea("behind", x, y, z))
      if (z === this.count.num - 1)
        areas.push(this.getArea('behind', x, y, z))
        areas.push(this.getArea('front', x, y, z))
      return areas
    },
    getAreaTransfroms(direct) {
      const transforms = {
        top: `translateY(-${this.side}px) rotateX(90deg)`,
        bottom: `translateY(${this.side}px) rotateX(-90deg)`,
        left: `translateX(-${this.side}px) rotateY(-90deg)`,
        right: `translateX(${this.side}px) rotateY(90deg)`,
        behind: `translateZ(-${this.side}px)`,
        front: `translateZ(0px)`
      }
      return transforms[direct]
    },
    getArea(direct, x, y, z) {
      // 定义各面平移和旋转

      const colors = {
        top: 'rgba(255, 102, 102)',
        bottom: "rgba(255, 255, 0)",
        left: "rgba(0, 102, 204)",
        right: "rgba(0, 153, 102)",
        front: "rgba(204, 51, 153)",
        behind: "rgba(102, 102, 102)",
        // inside: "white"
      }
      return {
        direct,
        transform: this.getAreaTransfroms(direct),
        color: colors[direct],

      }
    },
    changeColor() {
        // 获取所有x等于0的block，并将area.direct为bottom的p的color改为百色
        
    }
  }
})