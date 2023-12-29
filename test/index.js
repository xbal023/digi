import { DigiBuyer } from "../lib/index.js";

const digi = new DigiBuyer({ apikey: "abc", username: "absd" });
// Anda bisa menggunakan seperti ini
// const digi = new DigiBuyer("abc", "absd");
(async function () {
  // const sign = digi.__sign("tess");
  // console.log(sign);

  // Cek saldo
  const cekSaldo = await digi.cekSaldo();
  console.log(cekSaldo);

  const type = "prepaid"; // prepaid, pasca
  const price = await digi.daftarHarga(type);
  console.log(price);

  // depo
  const bank = "BRI", // BRI, MANDIRI, BNI, BCA
    ownerName = "NUR MUHAMMAD IQBAL SHOLAHUDDIN";
  const dep = await digi.deposit(10000, bank, ownerName);
  console.log(dep);

  const codeProduct = "123abc",
    customerNo = "6285879799927",
    refId = "your_id",
    opts = {}; // add your opts body, check other options in digiflazz docs

  const topup = await digi.topup(codeProduct, customerNo, refId, opts);
  console.log(topup);

  const cektagihan = await digi.cekTagihan(
    codeProduct,
    customerNo,
    refId,
    opts
  );
  console.log(cektagihan);

  const bayartagihan = await digi.bayarTagihan(
    codeProduct,
    customerNo,
    refId,
    opts
  );
  console.log(bayartagihan);

  const cekstatus = await digi.cekStatus(codeProduct, customerNo, refId, opts);
  console.log(cekstatus);

  const inquirypln = await digi.inquiryPLN(customerNo);
  console.log(inquirypln);
})();
