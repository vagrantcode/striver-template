
<script>
import TableSimple from './table-simple'
let _timer = null
export default {
  name: 'ElTableBase',
  components: { TableSimple },
  data () {
    return {
      tableRef: '_table',
      tableData: [],
      listTotal: 0,
      loadApi: null,
      delApi: null,
      saveApi: null,
      mulDelApi: null,
      proData: {
        show: false,
        title: '新增'
      },
      formData: {},
      searchParams: {},
      matchKey: null,
      tableSelects_tmp: [],
      searchParams_tmp: {}
    }
  },
  computed: {
    refForm () {
      return this.$refs[this.refFormStr]
    }
  },
  methods: {
    search () {
      if (_timer != null) {
        clearTimeout(_timer)
      }
      _timer = setTimeout(() => {
        this.searchParams_tmp = JSON.parse(JSON.stringify(this.searchParams))
        this.getList()
      }, 200)
    },
    getList () {
      // const loadIndex = layer.load(1)
      if (this.apiOrderColumns) {
        this.searchParams_tmp.orderColums = this.apiOrderColumns
      }
      this.loadApi(this.searchParams_tmp).then(res => {
        if (res.status) {
          if (this.localOrderColumns) {
            res.data = jsUtil.sortKeys(res.data, ...this.localOrderColumns)
          }
          this.tableData = res.data
          this.listTotal = res.total
        }
        // layer.close(loadIndex)
      })
    },
    edit (row) {
      this.proData.title = '编辑'
      try {
        this.formData = JSON.parse(JSON.stringify(row))
      } catch (e) {

      }

      this.showSetBox()
    },
    add () {
      this.proData.title = '新增'
      this.showSetBox()
      try {
        if (this.refForm) {
          this.refForm.resetForm()
        } else {
          const tp = this.refFormStr
          this.refFormStr = ''
          this.refFormStr = tp
        }
      } catch (e) {
        alert(e)
      }

      this.addExt()
    },
    addExt () {},
    showSetBox (val) {
      this.proData.show = (val === undefined ? true : val)
    },
    del (param) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.delApi) {
          // const loadIndex = layer.load(1)
          this.delApi(param).then(res => {
            // layer.close(loadIndex)
            if (res.status) {
              this.$message.info('删除成功')
              this.getList()
            } else {
              this.$message.error('删除失败' + res.msg)
            }
          })
        }
      })
    },
    saveForm (form) {
      let saveForm = this.formData
      if (form) {
        saveForm = form
      }
      if (this.saveApi) {
        // const loadIndex = layer.load(1)
        this.saveApi(saveForm).then(res => {
          // layer.close(loadIndex)
          if (res.status) {
            this.$message.info('保存成功')
            this.getList()
            this.showSetBox(false)
          } else {
            this.$message.error('保存失败')
            this.showSetBox()
          }
        })
      } else {
        this.$message.warning('请维护保存接口：saveApi')
      }
    },
    tableSelectChange (val) {
      this.tableSelects_tmp = val
    },
    toggleSelection (rows, matchKey) {
      const temp = []
      matchKey = this.matchKey || 'id'
      this.$refs.multipleTable.clearSelection()
      if (rows) {
        rows.forEach(row => {
          const ti = this.tableData.findIndex(res => {
            return res[matchKey] === row[matchKey]
          })
          if (ti !== -1) {
            temp.push(this.tableData[ti])
            this.$refs[this.tableRef].toggleRowSelection(this.tableData[ti])
          }
          this.tableSelects_tmp = temp
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    setTableSelects (val, matchKey) {
      this.tableSelects_tmp = val
      this.toggleSelection(this.tableSelects_tmp, matchKey)
    },
    multiDel (paramKey, matchKey) {
      paramKey = paramKey || 'ids'
      matchKey = matchKey || 'id'
      const param = {}
      param[paramKey] = ''
      if (this.tableSelects_tmp.length > 0) {
        const dels = []
        this.tableSelects_tmp.forEach(item => {
          dels.push(item[matchKey])
        })
        param[paramKey] = dels.join(',')
        if (this.mulDelApi) {
          this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res => {
            // const loadIndex = layer.load(1)
            this.mulDelApi(param).then(res => {
              // layer.close(loadIndex)
              if (res.status) {
                this.$message.info('删除成功')
                this.getList()
              } else {
                this.$message.error('删除失败')
              }
            })
          })
        }
      } else {
        this.$message.warning('未选中任何项！！')
      }
    },
    getSelects () {
      return this.tableSelects_tmp.length > 0 ? this.tableSelects_tmp : []
    }
  }
}
</script>

<style scoped>

</style>
