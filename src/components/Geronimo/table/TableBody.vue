<template>
  <div class="FTable">
  <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">

    <el-table-column
        v-if="index"
        type="index"
        label="序号"
        width="50"
    >
      <!--      注意分页 *页面大小*-->
      <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
    </el-table-column>

    <template v-for="(item,index) in tableOptions">

        <el-table-column
            v-if="!item.show?true:item.show"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
        >

          <!--        <template slot-scope="scope">-->

          <!--          <slot-->
          <!--              v-if="item.slot"-->
          <!--              :name="scope.column.property"-->
          <!--              :row="scope.row"-->
          <!--              :$index="scope.$index"-->
          <!--          />-->
          <!--          <span v-else>{{ scope.row[scope.column.property] }}</span>-->
          <!--        </template>-->

        </el-table-column>

    </template>

    <el-table-column
        label="操作"
        align="center">
      <template slot-scope="scope">
        <slot
            name="menu"
            :row="scope.row"
            :$index="scope.$index"
        />
      </template>
    </el-table-column>


  </el-table>

<!--    <Pagination />-->

  </div>

</template>

<script>
import {dataFormat} from "@/utils/util";

export default {
  name: "TableBody",

  props: {
    headers: {
      type: Array,
      default: function () {
        return ["用户ID", "用户名", "填报时间"]
      }
    },

    tableLoading: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    tableData: {
      type: Array,
      default: function () {
        return [{userId: "110", username: "qj", fillDate: dataFormat(new Date), fillData: ""}]
      }
    },
    tableOptions: {
      type: Array,
      default: function () {
        return [{
          label: '用户ID',
          prop: 'userId'
        },
          {
            label: '姓名',
            prop: 'username'
          },
          {
            label: '填报时间',
            prop: 'fillDate'
          }
        ]
      }
    },
    page: {
      type: Object,
      default: function () {
        return {
          total: 0,
          current: 1,
          page: 10
        }
      }
    },
    index: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  }
}
</script>

<style >

</style>
