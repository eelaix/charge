// aws apigateway get-rest-apis --query "items[?name=='a'].id" --output text
export const BASE: string = 'https://hbz68qhuab.execute-api.eu-west-3.amazonaws.com/a'

// @see https://paystack.com/docs/guides/accept_payments_on_your_vue_app
export const paystackpublickey: string = 'pk_test_ffffffffffffffffffffffffffffffffffffffff'

export const defaultpaystackid: string = 'info@eddivolt.one'

export const APPVERSION: string = '1.0.1'
export const prepaylimit: number = 100

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, '0')
}
export const formatDate = function (date: Date) {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(
      '-'
    ) +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds())
    ].join(':')
  )
}
export const getAssetsFile = function (url: string) {
  return new URL(`./assets/images/${url}`, import.meta.url).href
}
