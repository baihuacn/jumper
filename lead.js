/*
 * 控制跳跃的方块
 */
;(function() {
  // 跳动的方块的构造函数
  function Lead() {
    var canvas = window.canvas
    var ctx = window.ctx
    var _this = this

    this.leadInfo = {
      aureoleColor: '#888',
      moveDirection: null,
      position: {
        x: canvas.width / 10,
        y: (canvas.height / 10) * 9 - 48
      },
      size: {
        x: 24,
        y: 24
      }
    }
    this.state = {
      isAccunulate: false
    }
    this.aureoleRadius = {
      min: this.leadInfo.size.x * 0.4,
      max: this.leadInfo.size.x,
      current: this.leadInfo.size.x,
      step: (10 / 1000) * 5
    }
    this.aureolePosition = {
      x: this.leadInfo.position.x + this.leadInfo.size.x / 2,
      y: this.leadInfo.position.y + this.leadInfo.size.y / 2
    }
    this.sportInfo = {
      needAddSpeed: {
        x: false,
        y: true
      },
      addSpeed: {
        x: 300,
        y: 600
      },
      maxSpeed: {
        x: 240,
        y: 1200
      },
      speed: {
        x: 0,
        y: 0
      }
    }
    this.draw = draw
    this.move = move
    this.updateLeadAllPosition = updateLeadAllPosition
    this.accunulateJump = accunulateJump
    this.computeLeadPosition = computeLeadPosition
    this.updateLeadPositionAndSpeed = updateLeadPositionAndSpeed
    this.changeAddSpeed = changeAddSpeed
    this.changeSpeed = changeSpeed
    this.changeAureoleShrinkSpeed = changeAureoleShrinkSpeed
    this.changeAureoleIsShow = changeAureoleIsShow

    function draw() {
      _this.updateLeadAllPosition()

      var pi2 = 2 * Math.PI
      var leadInfo = _this.leadInfo
      var aureoleRadius = _this.aureoleRadius
      var aureolePosition = _this.aureolePosition

      // drawAureole
      if (_this.state.isAccunulate) {
        ctx.beginPath()
        ctx.strokeStyle = _this.leadInfo.aureoleColor
        ctx.arc(aureolePosition.x, aureolePosition.y, aureoleRadius.current, 0, pi2)
        ctx.stroke()
      }
      // draw body
      ctx.beginPath()
      ctx.fillStyle = leadInfo.bodyColor
      ctx.fillRect(leadInfo.position.x, leadInfo.position.y, leadInfo.size.x, leadInfo.size.y)
    }

    function updateLeadAllPosition() {
      computeAureolePosition()

      function computeAureolePosition() {
        var aureoleRadius = _this.aureoleRadius
        _this.aureolePosition.x = _this.leadInfo.position.x + _this.leadInfo.size.x / 2
        _this.aureolePosition.y = _this.leadInfo.position.y + _this.leadInfo.size.y / 2
        aureoleRadius.current = aureoleRadius.current - aureoleRadius.step
        if (aureoleRadius.current < aureoleRadius.min) {
          aureoleRadius.current = aureoleRadius.max
        }
        _this.aureoleRadius.current = aureoleRadius.current
      }
    }

    function move(direction) {
      if (direction === 'left' || direction === 'right' || direction === 'top' || direction === 'bottom') {
        _this.leadInfo.moveDirection = direction
      }
    }

    function accunulateJump(accunulateTime) {
      var accunulateSpeedPerTime = -1200

      if (_this.sportInfo.needAddSpeed.y) {
        var accunulateSpeed = accunulateSpeedPerTime * accunulateTime
        _this.sportInfo.speed.y = accunulateSpeed
      }
    }

    function computeLeadPosition(intervalTime) {
      var addSpeed = _this.sportInfo.addSpeed
      var maxSpeed = _this.sportInfo.maxSpeed
      var position = _this.leadInfo.position
      var speed = _this.sportInfo.speed
      var moveDirection = _this.leadInfo.moveDirection

      if (
        moveDirection === 'left' ||
        moveDirection === 'right' ||
        moveDirection === 'top' ||
        moveDirection === 'bottom' ||
        moveDirection === null
      ) {
        var xResult = computeXYPosition('x')
        var yResult = computeXYPosition('y')
        return {
          x: xResult,
          y: yResult
        }
      }

      function computeXYPosition(direction) {
        if (_this.sportInfo.needAddSpeed[direction]) {
          var currentSpeed = speed[direction] + addSpeed[direction] * (intervalTime / 1000)
          var computedSpeed = currentSpeed > maxSpeed[direction] ? maxSpeed[direction] : currentSpeed
          return {
            before: position[direction],
            after: position[direction] + computedSpeed * (intervalTime / 1000),
            speed: computedSpeed
          }
        } else {
          return {
            before: position[direction],
            after: position[direction] + speed[direction] * (intervalTime / 1000),
            speed: speed[direction]
          }
        }
      }
    }

    function updateLeadPositionAndSpeed(position) {
      updateXYPositionAndSpeed('x')
      updateXYPositionAndSpeed('y')

      function updateXYPositionAndSpeed(direction) {
        _this.sportInfo.speed[direction] = position[direction].speed
        _this.leadInfo.position[direction] = position[direction].after
      }
    }

    function changeAddSpeed(direction, addSpeed) {
      _this.sportInfo.addSpeed[direction] = addSpeed
    }

    function changeSpeed(direction, speed) {
      _this.sportInfo.speed[direction] = speed
    }

    function changeAureoleShrinkSpeed(speed, intervalTime) {
      var speed = speed || 5
      var intervalTime = intervalTime || 5
      _this.aureoleRadius.step = (speed / 1000) * intervalTime
    }

    function changeAureoleIsShow(state) {
      if (state === true || state === false) {
        _this.state.isAccunulate = state
      }
    }
  }
  // 创建一个跳动的方块的实例
  game.lead = new Lead()
})()
