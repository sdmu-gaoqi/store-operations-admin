import common from '@/servers/common'
import { RoyaltyType } from '@/types'
import { FormRender, Schema } from 'store-operations-ui'
import { defineComponent, onMounted, ref } from 'vue'

// @ts-nocheck

type Status = 'CREATED' | 'SUBMIT'

const OrderDetail = defineComponent({
  setup() {
    const orderId = 13
    const orderNo = '_Ol7kBkkyZKBLE-ys6_hg'
    const formRef = ref()
    const schema: Schema = {
      type: 'object',
      properties: {
        status: {
          title: ' 订单状态',
          widget: 'input',
          type: 'string',
          props: {
            readonly: true,
            bordered: false
          }
        },
        orderNo: {
          title: ' 订单编号',
          widget: 'input',
          type: 'string',
          props: {
            readonly: true,
            bordered: false
          }
        },
        settleType: {
          title: '订单类型',
          type: 'string',
          props: {
            readonly: true,
            bordered: false
          },
          widget: 'input',
          'ui:hidden': 'isEmpty(formState.value.settleType)'
        },
        table1: {
          widget: 'table',
          props: {
            columns: [
              {
                title: '会员卡号',
                dataIndex: 'memberNo'
              },
              {
                title: '姓名',
                dataIndex: 'memberName'
              },
              {
                title: '手机号',
                dataIndex: 'phone'
              },
              {
                title: '会员类型',
                dataIndex: 'memberTypeName'
              },
              {
                title: '优惠方式',
                dataIndex: 'discountRate'
              },
              {
                title: '会员卡余额',
                dataIndex: 'availableBalance'
              }
            ],
            pagination: false
          },
          'ui:hidden': 'isEmpty(formState.value.discountPrice)'
        },
        originalPrice: {
          title: '应收金额',
          type: 'string',
          widget: 'input',
          span: 12,
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden':
            '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId)'
        },
        占位: {
          span: 12
        },
        discountPrice: {
          title: '优惠',
          type: 'string',
          span: 12,
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'isEmpty(formState.value.discountPrice)'
        },
        receivePrice: {
          title: '原价',
          type: 'string',
          span: 12,
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'isEmpty(formState.value.receivePrice)'
        },
        payMethod: {
          title: '支付方式',
          type: 'string',
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'isEmpty(formState.value.payMethod)'
        },
        replenishPrice: {
          title: '补充金额',
          widget: 'input',
          type: 'string',
          defaultValue: '0',
          props: {
            min: 1,
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'isEmpty(formState.value.replenishPrice)'
        },
        remark: {
          title: ' 备注',
          type: 'string',
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          }
        },
        table: {
          widget: 'table',
          props: {
            columns: [
              {
                title: '项目名称',
                dataIndex: 'serviceProjectName'
              },
              {
                title: '单价',
                dataIndex: 'unitPrice'
              },
              {
                title: '上钟类型',
                dataIndex: 'royaltyType'
              },
              {
                title: '客数',
                dataIndex: 'customNum'
              },
              {
                title: '上钟数',
                dataIndex: 'serviceNum'
              },
              {
                title: '优惠',
                dataIndex: 'money'
              }
            ],
            pagination: false
          }
        }
      },
      displayType: 'row',
      column: 1,
      maxWidth: '340px',
      footer: {
        submit: false,
        cancel: '返回'
      }
    }
    onMounted(async () => {
      if (orderId) {
        const res = await common.orderDetail({ orderId, orderNo })
        formRef.value.changeState({
          orderNo: res?.data?.orderNo,
          originalPrice: res?.data?.originalPrice,
          receivePrice: res?.data?.receivePrice,
          replenishPrice: res?.data?.replenishPrice,
          table: res?.data?.orderItemList?.map((item: any) => ({
            ...item,
            money: (item?.originalPrice || 0) - (item?.discountPrice || 0),
            royaltyType: item.royaltyType === RoyaltyType.排钟 ? '排钟' : '点钟'
          })),
          status: res.data?.status === 'SUBMIT' ? '已结算' : '未结算'
        })
        console.log(res, 'res')
      }
    })
    return () => {
      return <FormRender schema={schema} ref={formRef} />
    }
  }
})

export default OrderDetail
