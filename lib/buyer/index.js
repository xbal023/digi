import md5 from "blueimp-md5";
import { fetch } from "undici";
import { join } from "path";

export class Digi {
  constructor(...args) {
    this._apikey = args?.[0]?.apikey || args?.[0];
    this._username = args?.[0]?.username || args?.[1];
    this.url = "https://api.digiflazz.com";
    this.version_api = args?.[0]?.version_api || args?.[2] || "v1";
    this.base_api = join(this.url, this.version_api);
    if (!this._apikey || !this._username)
      throw new Error(
        "required Arguments ({ apikey, username }) or (apikey, username)"
      );
  }
  __sign(key) {
    return md5(this._username + this._apikey + key);
  }
  __fetch(path, data) {
    return new Promise(async (resolve, reject) => {
      let body = JSON.stringify(data);
      fetch(join(this.base_api, path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
        .then((data) => data.json())
        .then((json) => resolve(json.data))
        .catch((e) => reject(e));
    });
  }
  async cekSaldo() {
    try {
      const sign = await this.__sign("depo");
      return this.__fetch("cek-saldo", {
        cmd: "deposit",
        username: this._username,
        sign,
      });
    } catch (e) {
      return new Error(e);
    }
  }
  async daftarHarga(type, code) {
    if (/(prepaid|pasca)/i.test(type))
      throw new Error(`Please choose "prepaid" or "pasca" in argument 1`);
    try {
      const sign = await this.__sign("pricelist");
      return this.__fetch("price-list", {
        cmd: type.toLowerCase(),
        username: this._username,
        sign,
        code,
      });
    } catch (e) {
      return new Error(e);
    }
  }

  async deposit(amount, bank, ownerName) {
    if (typeof amount !== "number")
      throw new Error(
        `Invalid type data argument 1, please use type data number`
      );
    if (/(bca|bri|bni|mandiri)/i.test(bank))
      throw new Error(`Please choose "BCA, BRI, BNI, MANDIRI"  in argument 2`);
    try {
      const sign = await this.__sign("deposit");
      return this.__fetch("deposit", {
        bank: type.toUpperCase(),
        amount,
        owner_name: ownerName,
        username: this._username,
        sign,
      });
    } catch (e) {
      return new Error(e);
    }
  }

  async topup(codeProduct, customerNo, refId, opts) {
    if (!codeProduct || !customerNo || refId)
      throw new Error(
        `Mising arguments 1, 2, 3 : "codeProduct, customerNo, refId"`
      );
    try {
      const sign = await this.__sign(refId);
      return this.__fetch("transaction", {
        ref_id: refId,
        buyer_sku_code: codeProduct,
        customer_no: customerNo,
        username: this._username,
        sign,
        ...opts,
      });
    } catch (e) {
      return new Error(e);
    }
  }

  async cekTagihan(codeProduct, customerNo, refId, opts) {
    if (!codeProduct || !customerNo || refId)
      throw new Error(
        `Mising arguments 1, 2, 3 : "codeProduct, customerNo, refId"`
      );
    try {
      const sign = await this.__sign(refId);
      return this.__fetch("transaction", {
        commands: "inq-pasca",
        ref_id: refId,
        buyer_sku_code: codeProduct,
        customer_no: customerNo,
        username: this._username,
        sign,
        ...opts,
      });
    } catch (e) {
      return new Error(e);
    }
  }

  async bayarTagihan(codeProduct, customerNo, refId, opts) {
    if (!codeProduct || !customerNo || refId)
      throw new Error(
        `Mising arguments 1, 2, 3 : "codeProduct, customerNo, refId"`
      );
    try {
      const sign = await this.__sign(refId);
      return this.__fetch("transaction", {
        commands: "pay-pasca",
        ref_id: refId,
        buyer_sku_code: codeProduct,
        customer_no: customerNo,
        username: this._username,
        sign,
        ...opts,
      });
    } catch (e) {
      return new Error(e);
    }
  }
  async cekStatus(codeProduct, customerNo, refId, opts) {
    if (!codeProduct || !customerNo || refId)
      throw new Error(
        `Mising arguments 1, 2, 3 : "codeProduct, customerNo, refId"`
      );
    try {
      const sign = await this.__sign(refId);
      return this.__fetch("transaction", {
        commands: "status-pasca",
        ref_id: refId,
        buyer_sku_code: codeProduct,
        customer_no: customerNo,
        username: this._username,
        sign,
        ...opts,
      });
    } catch (e) {
      return new Error(e);
    }
  }

  async inquiryPLN(customerNo) {
    if (!customerNo)
      throw new Error(
        `Mising arguments 1, 2, 3 : "codeProduct, customerNo, refId"`
      );
    try {
      return this.__fetch("transaction", {
        commands: "pln-subscribe",
        customer_no: customerNo,
      });
    } catch (e) {
      return new Error(e);
    }
  }
}
