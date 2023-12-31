<template>
  <TableRender
    v-if="schemaValue"
    :schema="schemaValue"
    :request="employee.list"
    ref="tableRef"
  >
    <template #formButton>
      <a-button
        type="primary"
        class="ml-[10px]"
        :onClick="goAdd"
        v-if="editEmployee"
        >新增员工</a-button
      >
    </template>
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn"
          v-if="editEmployee"
          @click="
            () => {
              router.push(`/employee/edit/${data.record.userId}`)
            }
          "
          >编辑</a
        >
        <a-popconfirm
          title="是否确认删除"
          :onConfirm="
            () => {
              employee.delete(data.record.userId).then((res) => {
                message.success('删除成功')
                const params = {
                  ...(toRaw(tableRef.params?.[0]) || {}),
                  pageNum: 1
                }
                tableRef.run(params)
              })
            }
          "
        >
          <a type="link" class="table-btn-danger last" v-if="editEmployee"
            >删除</a
          >
        </a-popconfirm>
      </div>
      <a-switch
        v-else-if="data?.column?.dataIndex === 'status'"
        :checked="data.record?.status == 0 ? true : false"
        :disabled="!editEmployee"
        @change="
          (v: any) => {
            employee
              .status({ userId: data.record.userId, status: v ? 0 : 1 })
              .then(() => {
                data.record.status = data.record?.status == 1 ? 0 : 1
              })
          }
        "
      ></a-switch>
      <template v-else-if="data.column?.dataIndex === 'roles'">{{
        data.record?.roles
          ?.map((item: any) => item?.roleName)
          ?.filter((item: any) => item)
          .join('、')
      }}</template>
      <template v-else-if="data.customer">{{ data.customer }}</template>
      <template v-else>{{ data.text }}</template>
    </template>
  </TableRender>
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import employee from '@/servers/employee'
import { onMounted, ref, toRaw } from 'vue'
import role from '@/servers/role'
import { cloneDeep } from 'wa-utils'
import { message } from 'ant-design-vue'
import { useAccess } from '@/hooks'
import { useStore } from 'vuex'

const { editEmployee } = useAccess()
const store = useStore()

const schemaValue = ref()
const tableRef = ref()

onMounted(async () => {
  await role.roleMap()
  const cloneData = cloneDeep(schema)
  if (cloneData.options) {
    cloneData.options.roleId = role.roles
  }
  schemaValue.value = cloneData
})

const router = useRouter()

const goAdd = () => {
  router.push('/employee/add')
}
</script>
