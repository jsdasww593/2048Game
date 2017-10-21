(function($){
      
    let Game2048 = function(ele,options){

       /* 整体游戏样式及游戏数据 */        
       let defaultOption = {
        width: 4,
        height: 4,
        style: {
          background_color: "rgb(184,175,158)",
          block_background_color: "rgb(204,192,178)",
          padding: 18,
          block_size: 100,
          block_shake_size: 10,
          block_style: {
            "font-family": "微软雅黑",
            "font-weight": "bold",
            "text-align": "center"
          }
        },
        blocks: [
          { level: 0, value: 2, style: { "background-color": "rgb(238,228,218)", "color": "rgb(124,115,106)", "font-size": 58 } },
          { level: 1, value: 4, style: { "background-color": "rgb(236,224,200)", "color": "rgb(124,115,106)", "font-size": 58 } },
          { level: 2, value: 8, style: { "background-color": "rgb(242,177,121)", "color": "rgb(255,247,235)", "font-size": 58 } },
          { level: 3, value: 16, style: { "background-color": "rgb(245,149,99)", "color": "rgb(255,250,235)", "font-size": 50 } },
          { level: 4, value: 32, style: { "background-color": "rgb(244,123,94)", "color": "rgb(255,247,235)", "font-size": 50 } },
          { level: 5, value: 64, style: { "background-color": "rgb(247,93,59)", "color": "rgb(255,247,235)", "font-size": 50 } },
          { level: 6, value: 128, style: { "background-color": "rgb(236,205,112)", "color": "rgb(255,247,235)", "font-size": 42 } },
          { level: 7, value: 256, style: { "background-color": "rgb(237,204,97)", "color": "rgb(255,247,235)", "font-size": 42 } },
          { level: 8, value: 512, style: { "background-color": "rgb(236,200,80)", "color": "rgb(255,247,235)", "font-size": 42 } },
          { level: 9, value: 1024, style: { "background-color": "rgb(237,197,63)", "color": "rgb(255,247,235)", "font-size": 34 } },
          { level: 10, value: 2048, style: { "background-color": "rgb(238,194,46)", "color": "rgb(255,247,235)", "font-size": 34 } },
          { level: 11, value: 4096, style: { "background-color": "rgb(61,58,51)", "color": "rgb(255,247,235)", "font-size": 34 } }
        ],
        animateSpeed: 100
       };

       this.$ele = ele;

       this.state = [];

       this.options = $.extend({},defaultOption,options);

       this.lastMovedTime = 0;
       
       this.mouseStartPoint = null;

       this.init();
        
    };

    Game2048.prototype = {
        init(){ 
             let options = this.options;
             /* 游戏外层样式 */
             this.$ele.css({
                'background-color':options.style.background_color,
                'border-radius':options.style.padding,
                'position':'relative',
                "-webkit-user-select": "none"
             });
             this.gameStart();
        },
         /* 计算x,y坐标 */
        getPosition(x,y){
            let options = this.options;
            return{
                top:options.style.padding + y * ( options.style.padding + options.style.block_size),
                left:options.style.padding + x * ( options.style.padding + options.style.block_size)
            }
        },
        getIndex(x,y){
             return x + y * this.options.width;
        },
         /* 获取当前的空位 */
        getEmptyBlockIndexs(){
             let emptyBlockIndexs = [];
             $(this.state).each(function(i,o){
                    if( o === null ) emptyBlockIndexs.push(i);
             });
             return emptyBlockIndexs;
        },
          /* 获取当前块的x,y坐标 */
        getCoordinate(index){
             let options = this.options;
             return {
                 x:index % options.width,
                 y:Math.floor(index/options.height)
             }    
        },
        getBlock(x,y){
             return this.state[this.getIndex(x,y)];
        },
        buildBackground(){
            /* 游戏内层样式 */
            let options = this.options,
                $ele = this.$ele,
                backgrounds = [],
                bg_blockArr = [[options.width],[options.height]];
                for( let x = 0; x < options.width; x++ ){
                    for( let y = 0; y < options.height; y++ ){
                    this.state.push(null);
                    let bg_block = $('<div></div>'),
                        position = this.getPosition(x,y);
                    bg_block.css({
                            "width":options.style.block_size,
                            "height":options.style.block_size,
                            "background-color":options.style.block_background_color,
                            "position":"absolute",
                            "top":position.top,
                            "left":position.left
                    });
                    backgrounds.push(bg_block);
                    }
                }
                $ele.append(backgrounds);
                $ele.width(( options.style.block_size + options.style.padding) * options.width + options.style.padding);
                $ele.height(( options.style.block_size + options.style.padding) * options.height + options.style.padding);
        },
         /* 随机生成两个block */
        buildBlock(level,x,y){
             let options = this.options, 
                 emptyBlockIndexs = this.getEmptyBlockIndexs();
             if( emptyBlockIndexs.length === 0 ) return false;
             let putIndex;
             if( x!== undefined && y!== undefined ){
                  putIndex = getIndex(x,y);
             }else{
                 putIndex = emptyBlockIndexs[Math.floor(Math.random()*emptyBlockIndexs.length)];
             }

             if(this.state[putIndex] != null) throw "已经有块存在"
             let block;
             if(level === undefined){
               block = Math.random() >= 0.5 ? options.blocks[0] : options.blocks[1];
             }else{
               block = $.extend({}, options.blocks[level]);
             }
             let coordinate = this.getCoordinate(putIndex);
             let position = this.getPosition(coordinate.x, coordinate.y);
             let blockDom = $('<div></div>');
             blockDom.addClass("block_" + coordinate.x + "_" + coordinate.y);
             blockDom.css($.extend(options.style.block_style,{
               "position": "absolute",
               "top": position.top + options.style.block_size / 2,
               "left": position.left + options.style.block_size / 2,
               "line-height": options.style.block_size + "px",
               "width": 0,
               "height": 0,
             }, block.style));
             
             this.$ele.append(blockDom);
             this.state[putIndex] = block;
         
             blockDom.animate({
               "width": options.style.block_size,
               "height": options.style.block_size,
               "top": position.top,
               "left": position.left
             }, options.animateSpeed , (function(blockDom){
               return function(){
                   blockDom.html(block.value);
               }
             })(blockDom));

             if(emptyBlockIndexs.length === 1){
                let canMove = false,
                    options = this.options,
                    state = this.state;
                for(var x=0; x<options.width-1 && !canMove; x++) {
                  for(var y=0; y<options.height-1 && !canMove; y++){
                    if(x > 0 && state[this.getIndex(x - 1, y)].value == state[this.getIndex(x, y)].value){
                      canMove = true; 
                    }
                    if(x < options.width && state[this.getIndex(x + 1, y)].value == state[this.getIndex(x, y)].value){
                      canMove = true;
                    }
                    if(y > 0 && state[this.getIndex(x, y - 1)].value == state[this.getIndex(x, y)].value){
                      canMove = true;
                    }
                    if(y < options.height && state[this.getIndex(x, y + 1)].value == state[this.getIndex(x, y)].value){
                      canMove = true;
                    }
                  }
                }
                if(!canMove){
                  this.gameEnd();
                  return false;
                }
              }

             return true;
        },
         /* 方块移动动画 */
        move(direction){
            let options = this.options;
            if(new Date() - this.lastMovedTime < options.animateSpeed + 20) return;
            this.lastMovedTime = new Date();
            let startX,startY,endX, endY, modifyX,modifyY,
                doActioned = false;
            switch(direction){
              case "up":
                startX = 0;
                endX = options.width - 1;
                startY = 1;
                endY = options.height - 1;
                modifyX = 0;
                modifyY = -1;
                break;
              case "down":
                startX = 0;
                endX = options.width - 1;
                startY = options.height - 2;
                endY = 0;
                modifyX = 0;
                modifyY = 1;
                break;
              case "left":
                startX = 1;
                endX = options.width - 1;
                startY = 0;
                endY = options.height - 1;
                modifyX = -1;
                modifyY = 0;
                break;
              case "right":
                startX = options.width - 2;
                endX = 0;
                startY = 0;
                endY = options.height - 1;
                modifyX = 1;
                modifyY = 0;
                break;
            }
            for(let x = startX; x <= Math.max(startX, endX) && x >= Math.min(startX, endX); endX > startX ? x++ : x--){
              for(let y = startY; y <= Math.max(startY,endY) && y >= Math.min(startY, endY); endY > startY ? y++ : y--){
                let block = this.getBlock(x, y);
                if(block === null) continue;
                let target_coordinate = {x:x, y:y};
                let target_block;
                let moved = 0;
                do{
                  if(++moved > Math.max(options.width, options.height)) break;
                  target_coordinate.x += modifyX;
                  target_coordinate.y += modifyY;
                  target_block = this.getBlock(target_coordinate.x, target_coordinate.y);
                  if(direction === "up" || direction === "down"){
                    if(target_coordinate.y == 0 || target_coordinate.y === options.height - 1) break;
                  }
                  if(direction === "left" || direction === "right"){
                    if(target_coordinate.x === 0 || target_coordinate.x === options.width - 1) break;
                  }
                }while(target_block === null)
        
                let blockDom = $(".block_" + x + "_" + y);
                
                if(target_block === null){
                  let position = this.getPosition(target_coordinate.x, target_coordinate.y);
                  this.state[this.getIndex(x, y)] = null;
                  this.state[this.getIndex(target_coordinate.x, target_coordinate.y)] = block;
                  blockDom.removeClass();
                  blockDom.addClass("block_" + target_coordinate.x + "_" + target_coordinate.y)
                  blockDom.animate({
                    "top": position.top,
                    "left": position.left
                  }, options.animateSpeed)
                }else if(target_block.value === block.value && !target_block.justModified){
                  let position = this.getPosition(target_coordinate.x, target_coordinate.y);
                  let updatedBlock = $.extend({}, options.blocks[block.level + 1]);
                  if(updatedBlock.level === options.blocks.length - 1){
                     this.gameEnd();
                  }
                  updatedBlock.justModified = true;
                  this.state[this.getIndex(x, y)] = null;
                  this.state[this.getIndex(target_coordinate.x, target_coordinate.y)] = updatedBlock;
                  let target_blockDom = $(".block_" + target_coordinate.x + "_" + target_coordinate.y);
                  blockDom.animate({
                    "top": position.top,
                    "left": position.left
                  }, options.animateSpeed, (function(blockDom, target_blockDom, target_coordinate, updatedBlock){
                    return function(){
                      blockDom.remove();
                      target_blockDom.html(updatedBlock.value);
                      target_blockDom.css(updatedBlock.style);
                    };
                  }(blockDom, target_blockDom, target_coordinate, updatedBlock)))
                }else if(target_block.value !== block.value || moved > 1){
                  target_coordinate.x = target_coordinate.x - modifyX;
                  target_coordinate.y = target_coordinate.y - modifyY;
                  if(target_coordinate.x === x && target_coordinate.y == y) continue;
                  let position = this.getPosition(target_coordinate.x, target_coordinate.y);
                  this.state[this.getIndex(x, y)] = null;
                  this.state[this.getIndex(target_coordinate.x, target_coordinate.y)] = block;
                  blockDom.removeClass();
                  blockDom.addClass("block_" + target_coordinate.x + "_" + target_coordinate.y)
                  blockDom.animate({
                    "top": position.top,
                    "left": position.left
                  }, options.animateSpeed)
                }else{
                  continue;
                }
                doActioned = true;
              }
            }
            for(let x=0; x<options.width; x++){
              for(let y=0; y<options.height; y++){
                let block = this.getBlock(x, y);
                if(block == null) continue;
                delete block.justModified;
              }
            }
            if(doActioned) {
              this.buildBlock();
            }
        },
        /* 键盘操作游戏 */
        keyHandler(e){
          switch(e.which){
            case 38:
            this.move("up");
            break;
            case 40:
            this.move("down");
            break;
            case 37:
            this.move("left");
            break;
            case 39:
            this.move("right");
            break;
          }
        
        },
        /* 鼠标操作游戏 */
        mouseHandler(e){
          if(e.type === "mousedown" && this.mouseStartPoint === null){
            this.mouseStartPoint = {x: e.pageX, y: e.pageY};
          }
          if(e.type == "mouseup"){
            let xDistance = e.pageX - this.mouseStartPoint.x;
            let yDistance = e.pageY - this.mouseStartPoint.y;
            if(Math.abs(xDistance) + Math.abs(yDistance) > 20){
              if(Math.abs(xDistance) >= Math.abs(yDistance)){
                if(xDistance > 0){
                  this.move("right");
                }else{
                  this.move("left");
                }
              }else{
                if(yDistance > 0){
                  this.move("down");
                }else{
                  this.move("up");
                }
              }
            }
            this.mouseStartPoint = null;
          }
        },
        /* 游戏开始 */
        gameStart(){
            $(document).on("keydown",(e)=>{
                this.keyHandler(e);
            });
            $(document).on("mousedown",(e)=>{
                this.mouseHandler(e);
            });
            $(document).on("mouseup",(e)=>{
                this.mouseHandler(e);
            });

            console.log("游戏开始")

            this.$ele.html('');
            this.state = [];
        
            this.buildBackground();
            this.buildBlock();
            this.buildBlock();
        },
        /* 游戏结束 */
        gameEnd(){
            let options = this.options,
                 $ele = this.$ele;

            $(document).off("keydown",(e)=>{
                this.keyHandler(e);
            });
            // $(document).off("mousedown",mouseHandler);
            // $(document).off("mouseup",mouseHandler); 

            let score = 0;
            for(let i=0; i<this.state.length; i++){
              if(this.state[i] == null) continue;
                score += Math.pow(2, this.state[i].level + 1);
            }

            console.log("游戏结束, 您的分数为:", score);

            let $endMask = $("<div></div>");
            let $mask = $("<div></div>")

            $mask.css({
              "background-color": options.style.background_color,
              "border-radius": options.style.padding,
              "position": "absolute",
              "-webkit-user-select": "none",
              "opacity": 0.5,
              "width": $ele.width(),
              "height": $ele.height()
            })

            let $title = $("<h1>游戏结束</h1>");
            let $result = $("<p>您的分数为:" + score + "</p>");
            let $again = $("<button>再玩一次</button>");

            $again.click(function(e){
              e.preventDefault();
              this.gameStart();
            })

            let $content = $("<div></div>");
            $content.css({
              "width": "200px",
              "text-align": "center",
              "margin": "0 auto",
              "position": "absolute",
              "top": "50%",
              "transform": "translate(-50%, -50%)",
              "left": "50%",
              "padding": 10,
              "background-color": options.style.block_background_color
            })
            $endMask.append($mask)
            $content.append($title);
            $content.append($result);
            $content.append($again);
            $endMask.append($content);
            $ele.append($endMask);
          }
    }

    $.fn.game2048 = function(options){

         return new Game2048(this,options);

    };

})(jQuery);