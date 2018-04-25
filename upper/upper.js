
/*
* 图片上传组件
* @param {object} options 自定义配置
*
* */

!function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory)
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory()
	} else {
		root.Upper = factory()
	}
}(window, () => {
	class Upper {
		constructor(options) {
			this.upperInput = options.upperInput
			//压缩限制,超过限制进行压缩
			this.maxSize = options.maxSize || 1024 * 30
			//文件信息
			this.fileInfo = {}
			//压缩系数
			this.encoderOptions = null
			this.init()
		}

		init() {
			this.bind()
		}

		bind() {
			this.upperInput.addEventListener('change', (event) => {
				const file = event.target.files[0]
				const reader = new FileReader()
				//记录文件相关信息
				this.fileInfo.type = file.type || 'image/jpeg'
				this.fileInfo.size = file.size
				this.fileInfo.name = file.name
				this.fileInfo.lastModifiedDate = file.lastModifiedDate
				//把文件转换成base64进行处理
				reader.onload =  (event) => {
					//base64格式文件
					const result = event.target.result
					//判断是否进行压缩
					if (this.fileInfo.size > this.maxSize) {
						this.compressImage(result).then(compressBase64 => this.toBlob(compressBase64)).then(fileInfo => {
							console.log('压缩了')
							//fileInfo包含了文件的blob、blobURL以及其他信息
							console.log(fileInfo)
						})
					} else {
						this.toBlob(result).then(fileInfo => {
							console.log('没压缩')
							console.log(fileInfo)
						})
					}
				}
				reader.readAsDataURL(file)
			})
		}

		compressImage(base64) {
			const encoderOptions = this.encoderOptions || 0.5
			return new Promise((resolve, reject) => {
				const image = new Image()
				image.onload =  () => {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					const IMG_WIDTH = image.width
					const IMG_HEIGHT = image.height
					let compressBase64 = ''
					canvas.width = IMG_WIDTH
					canvas.height = IMG_HEIGHT
					ctx.drawImage(image, 0, 0, IMG_WIDTH, IMG_HEIGHT)
					compressBase64 = canvas.toDataURL('image/jpeg', encoderOptions)
					resolve(compressBase64)
				}
				image.src = base64
			})
		}

		toBlob(base64) {
			//解码base64
			const decodedData = window.atob(base64.split(',')[1])
			const arrayBuffer = new ArrayBuffer(decodedData.length)
			const uint8 = new Uint8Array(arrayBuffer)
            const URL = window.URL || window.webkitURL || window.mozURL
			let blob = '',blobURL = ''
			return new Promise((resolve,reject)=>{
				for (let i = 0; i < decodedData.length; i++) {
					uint8[i] = decodedData.charCodeAt(i)
				}
				try {
					blob = new Blob([uint8],{type:this.fileInfo.type})
					blobURL = URL.createObjectURL(blob)
					this.fileInfo.file = blob
					this.fileInfo.fileURL = blobURL
					resolve(this.fileInfo)
				} catch (error) {
					//兼容处理
					window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
					if (error.name === 'TypeError' && window.BlobBuilder) {
						const builder = new BlobBuilder()
						builder.append(uint8)
						blob = builder.getBolb(this.fileInfo.type)
						blobURL = URL.createObjectURL(blob)
                        this.fileInfo.file = blob
                        this.fileInfo.fileURL = blobURL
                        resolve(this.fileInfo)
					} else {
						console.log('不支持图片上传')
                        reject()
					}
				}
			})
		}

	}
	return Upper
})