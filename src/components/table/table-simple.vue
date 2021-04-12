<template>
  <div style="height: 100%;width:100%;position: relative;overflow: hidden;">
    <div style="height: calc(100% - 2.6em);overflow-y: scroll;width: calc(100% + 14px)">
      <div class="table-box">
        <!--固定的表头-->
        <div class="table-head">
          <table class="simple-table" cellspacing="0">
            <colgroup />
            <thead>
              <th v-for="(item,index) in tHeadList" :key="index" :style="{width:item.width}" :title="item.title" @click="sort(index)">
                <span class="titleBox" :class="{sortMaxTitle:isSort}">{{ item.title }} </span>
                <span v-show="isSort||item.sort===true" v-if="useSerialNumber!==true&&(useOperate===true&&index!==tHeadList.length-1)" style="position: absolute;margin: 0.1em;right: 0">
                  <i class="asc" :class="{ascSelected:sortStatus===1&&sortIndex===index}" />
                  <i class="dsc" :class="{dscSelected:sortStatus===2&&sortIndex===index}" />
                  <div style="display: inline-block;width: 1em;" />
                </span>
                <span v-show="isSort||item.sort===true" v-if="useSerialNumber===true&&index!==0&&(useOperate===true&&index!==tHeadList.length-1)" style="position: relative;margin: 0.1em;">
                  <i class="asc" :class="{ascSelected:sortStatus===1&&sortIndex===index-1}" />
                  <i class="dsc" :class="{dscSelected:sortStatus===2&&sortIndex===index-1}" />
                  <div style="display: inline-block;width: 1em;" />
                </span>
              </th>
            </thead>
          </table>
        </div>
        <!--表格-->
        <table class="simple-table" cellspacing="0">
          <colgroup />
          <thead>
            <th v-for="(item,index) in tHeadList" :key="index" :style="{width:item.width}" :title="item.title" @click="sort(index)">
              <span class="titleBox" :class="{sortMaxTitle:isSort}">{{ item.title }} </span>
            </th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tBodyList" :key="index" :class="{odd:isZebra===true&&index%2!==0}" @click="rowClick(item)">
              <td v-if="useSerialNumber">{{ index+1 }}</td>
              <td v-for="(item2,index2) in colum" :key="index2" @click="tdClick(item[item2.data],item)">{{ item[item2.data] }}</td>
              <td v-if="useOperate"><slot :row="item" /></td>
            </tr>
          </tbody>
        </table>
        <div v-if="tBodyList.length===0" style="text-align: center;padding: 0.5em;">无记录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableSimple',
  props: {
    tableData: { data: Array, colum: Array },
    useSerialNumber: true,
    serialNumberName: String,
    useOperate: Boolean,
    operateName: String,
    useZebra: Boolean,
    useSort: Boolean
  },
  data () {
    return {
      tHeadList: ['表头1', '表头2', '表头3', '表头4', '表头5', '表头6'],
      tBodyList: this.tableData.data,
      colum: [{ data: '', width: '' }],
      maxNumber: 0,
      oprateText: this.operateName,
      serialNumberText: this.serialNumberName,
      sortStatus: 0, // 0不排序，1，正序，2，倒序
      sortIndex: 0, // 排序的列的序号
      isZebra: false,
      isSort: false
    }
  },
  computed: {
    tData () {
      return this.tableData.data
    }
  },
  watch: {
    tData: {
      handler: function (nV, oV) {
        this.tBodyList = nV
        this.viewData()
      } }
  },
  mounted () {
    this.tHeadList = []
    this.colum = this.tableData.colum
    this.isZebra = this.useZebra === undefined ? false : this.useZebra
    this.isSort = this.useSort
    this.viewData()
  },
  methods: {
    sort (index) {
      if (!this.isSort) {
        return false
      }
      if (this.useSerialNumber) {
        index = index - 1
      }
      if (this.sortIndex !== index) {
        this.sortStatus = 0
        this.sortIndex = index
      }
      let colum = ''
      try {
        colum = this.colum[index]['data']
      } catch (e) {
        return false
      }
      const data = this.tBodyList.slice(0)
      function compare (property, type) {
        return function (a, b) {
          var x = a[property] === undefined ? '' : a[property]
          var y = b[property] === undefined ? '' : b[property]
          if (type === 1) {
            return x < y ? -1 : x > y ? 1 : 0
          } else {
            return x < y ? 1 : x > y ? -1 : 0
          }
        }
      }
      this.sortStatus += 1
      if (this.sortStatus > 2) {
        this.sortStatus = 0
      }
      switch (this.sortStatus) {
        case 0:
          this.tBodyList = this.tableData.data
          break
        case 1:
          data.sort(compare(colum, 1))
          this.tBodyList = data.slice(0)
          break
        case 2:
          data.sort(compare(colum, 2))
          this.tBodyList = data.slice(0)
          break
        default:
          break
      }
    },
    viewData () {
      const ls = this.tableData.colum
      const headerList = ls.slice(0)
      if (this.useSerialNumber) {
        if (!this.serialNumberText) {
          this.serialNumberText = '编号'
        }
        headerList.unshift({ title: this.serialNumberText })
        this.maxNumber = 0
      }
      if (this.useOperate) {
        if (!this.oprateText) {
          this.oprateText = '操作'
        }
        headerList.push({ title: this.oprateText })
        this.maxNumber = 0
      }
      this.tHeadList = headerList
    },
    tdClick (content, row) {
      this.$emit('tdClick', content, row)
    },
    rowClick (row) {
      this.$emit('rowClick', row)
    }
  }
}
</script>
<style>
  .table-box {
    width: 100%;
    max-height: 100%;
  }
  .simple-table {
    width: 100%;
    table-layout: fixed;
    word-break: break-all;
  }
  .table-head {
    position: absolute;
    top: 0;
    z-index: 10;
  }
  .simple-table thead {
    vertical-align: middle;
  }
  .simple-table thead th {
    position: relative;
    color: #fff;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    user-select: none;
    background-color: #354c4b;
    padding: 10px 8px;
    vertical-align: middle;
    text-align: left;

    border-bottom: 2px solid black;
    min-width: 1em;
  }
  .simple-table thead th .titleBox {
    max-width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .sortMaxTitle{
    max-width: calc(100% - 0.6em)!important;
  }
  .simple-table tbody tr {
  }
  .simple-table tbody tr:hover {
    cursor: pointer;
    background: rgba(137, 137, 143, 0.97);
  }
  .simple-table tbody tr td {
    padding: 0.5em 8px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    background: #ffffff00;
    border-bottom: 1px solid #888888;
  }
  .asc {
    position: absolute;
    border-left: 0.35em solid transparent;
    border-right: 0.35em solid transparent;
    border-bottom: 0.35em solid #acafb6;
  }
  .ascSelected {
    border-bottom: 0.35em solid #161616;
  }
  .dsc {
    position: absolute;
    bottom: 0;
    border-left: 0.35em solid transparent;
    border-right: 0.35em solid transparent;
    border-top: 0.35em solid #acafb6;
  }
  .dscSelected {
    border-top: 0.35em solid #161616;
  }
  .simple-table .odd {
    background: #badafd;
  }
</style>
