 function (win) {
    function Olert() {
        this.wrap = null
        this.contentWrap = null
        this.olertWrap = null
        this.confirmBtn = null
        this.confirmHandler = null 
        this.init()
        this.bind()
    }
    
    //启动函数
    Olert.prototype.init = function () {
        let html = `<div class="olert">
                        <p class="content"></p>
                        <div class="comfirm-button">确定</div>
                    </div>`
        let wrap = document.createElement('div')
        wrap.classList.add('olert-modal')
        wrap.innerHTML = html
        document.body.appendChild(wrap)
        this.wrap = document.querySelector('.olert-modal')
        this.contentWrap = document.querySelector('.olert-modal .content')
        this.olertWrap = document.querySelector('.olert-modal .olert')
        this.confirmBtn = document.querySelector('.olert-modal .comfirm-button')
    }

    Olert.prototype.show = function(options){
        this.contentWrap.innerText = options.content
        this.olertWrap.classList.add(options.tween)
        this.wrap.style.display = 'block'
        this.confirmHandler = options.comfirm
    }

    Olert.prototype.bind = function(){
        let _this = this
        _this.confirmBtn.addEventListener('click', function () {
            _this.wrap.style.display = 'none'
            _this.confirmHandler && _this.confirmHandler.call()
        })
    }
    win.olert = new Olert()
}(window)