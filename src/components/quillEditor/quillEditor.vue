<template>
  <div class="box">
    <div v-show="options.readOnly" style="text-align: right;position: absolute;top: 0;right:0;z-index: 999;">
      <el-button type="info" size="small" @click="ableEditTitle">编辑</el-button>
    </div>
    <div v-show="!options.readOnly" id="editconter" style="height: calc(100% - 50px);width: 100%;margin: 0 auto;">
      <div id="editor" class="ql-editor ql-snow">
        <div id="toolbar-container" />
      </div>
    </div>
    <div v-show="options.readOnly" style="height: calc(100% - 0px);padding: 5px 15px;box-sizing: border-box;overflow: auto;" v-html="contentStr" />
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'QuillEditor',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String
  },
  data() {
    const _this = this
    return {
      quill: null,
      templateData: null,
      options: {
        debug: 'error',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }], // custom button values
              [{ 'direction': 'rtl' }], // text direction

              [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              /* ['sourceEditor'],*/
              ['themeChange'],
              ['clean'] // remove formatting button
            ],
            handlers: {
              /* 'sourceEditor': function(val) { // 添加工具方法
                _this.options.readOnly = true
                _this.options.theme = 'bubble'
                _this.quillRestart()
              },*/
              'themeChange': function() {
                if (_this.options.theme === 'snow') {
                  _this.options.theme = 'bubble'
                } else {
                  _this.options.theme = 'snow'
                }
                _this.quillRestart()
              }
            }
          }

        },
        /*  placeholder: '编辑文章内容', */
        readOnly: true,
        theme: 'bubble'// bubble文中位置模式，snow头模式
      },
      contentStr: ''
    }
  },
  watch: {
    value(nVal, oVal) {
      if (nVal.toString() !== this.contentStr) {
        this.setInnerHtml(nVal)
      }
    }
  },
  mounted() {
    this.quillInit()
    this.ableEditTitle()
  },
  destroyed() {
    this.quill = null
  },
  methods: {
    initButton() { // 在使用的页面中初始化按钮样式
    /*  const sourceEditorButton = document.querySelector('.ql-sourceEditor')
      sourceEditorButton.style.cssText = 'width:80px; border:1px solid #ccc; border-radius:5px;'
      if (this.options.readOnly) {
        sourceEditorButton.innerText = 'EditAble'
      } else {
        sourceEditorButton.innerText = 'EditDisable'
      }*/
      const theme = document.querySelector('.ql-themeChange')
      theme.style.cssText = 'width:auto; border:1px solid #ccc; border-radius:5px;'
      theme.innerText = 'Theme'
    },
    getContent() {
      const result = this.quill.getContents()
      console.log(this.quill.root.innerHTML)
      console.log(result)
      return result
    },
    setContent(content) {
      console.log(this.templateData)
      this.contentStr = content
      this.quill.setContents(content, 'api')
    },
    getInnerHtml() {
      /* this.contentStr = this.quill.root.innerHTML
      return this.quill.root.innerHTML*/
      this.contentStr = this.quill.getText()
      return this.quill.getText()
    },
    setInnerHtml(content) {
      this.contentStr = content
      /* this.quill.root.innerHTML = content*/
      this.quill.setText(content)
    },
    ableEditTitle() {
      this.options.readOnly = false
      this.options.theme = 'snow'
      this.quillRestart()
    },
    quillRestart() {
      document.getElementById('editconter').innerHTML = '   <div id="editor" class="ql-editor ql-snow">\n' +
        '          <div id="toolbar-container">\n' +
        '\n' +
        '          </div>\n' +
        '       <!--   <p>Hello World!</p>\n' +
        '          <p>Some initial <strong>bold</strong> text</p>\n' +
        '          <p><br></p>-->\n' +
        '        </div>'
      this.quillInit()
      this.setInnerHtml(this.value)
    },
    quillInit() {
      this.quill = new Quill('#editor', this.options)
      this.quill.on('editor-change', (eventName, ...args) => {
        if (eventName === 'text-change') {
          // args[0] will be delta
        } else if (eventName === 'selection-change') {
          // args[0] will be old range
        }

        this.$emit('change', this.getInnerHtml())
      })
      this.initButton()
    }
  }
}
</script>

<style scoped>
.box{
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
<style>
  .ql-tooltip{
    left: 0;
  }
</style>
