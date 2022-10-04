export default interface ITokentService {
  encode(paload: string | object):string | object
  decode(token: string | object) : string | object
}