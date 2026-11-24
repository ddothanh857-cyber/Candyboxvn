const trangThaiBanDau = {
  keo: 0,
  lucNhan: 1,
  moiGiay: 0,
  tongKeo: 0,
};

let duLieu = napDuLieu();

const nangCap = [
  {
    id: "tay",
    ten: "Tay vàng",
    moTa: "+1 kẹo mỗi lần nhấn",
    icon: "🖐️",
    gia: 15,
    tangGia: 1.75,
  },
  {
    id: "tho",
    ten: "Thỏ thần",
    moTa: "+3 kẹo mỗi lần nhấn",
    icon: "🐰",
    gia: 80,
    tangGia: 1.9,
  },
  {
    id: "may",
    ten: "Máy sản xuất",
    moTa: "+2 kẹo mỗi giây",
    icon: "🏭",
    gia: 55,
    tangGia: 1.85,
  },
  {
    id: "phaLe",
    ten: "Pha lê may mắn",
    moTa: "+12 kẹo mỗi giây",
    icon: "🔮",
    gia: 300,
    tangGia: 2,
  },
];

const thanhTich = [
  {
    id: "lanDau",
    ten: "Nếm vị ngọt",
    moTa: "Có 1 viên kẹo",
    dieuKien: d => d.keo >= 1,
  },
  {
    id: "tram",
    ten: "Người thích kẹo",
    moTa: "Tích trữ 100 kẹo",
    dieuKien: d => d.keo >= 100,
  },
  {
    id: "nghin",
    ten: "Báu vật đường",
    moTa: "Tích trữ 1.000 kẹo",
    dieuKien: d => d.tongKeo >= 1000,
  },
  {
    id: "sieuMay",
    ten: "Hiện đại hóa",
    moTa: "Có sản lượng tự động",
    dieuKien: d => d.moiGiay >= 1,
  },
];

function napDuLieu() {
  const duLieuCu = localStorage.getItem("candybox-viet");

  if (!duLieuCu) {
    return {
      ...trangThaiBanDau,
      nangCap: {},
      thanhTich: {},
    };
  }

  try {
    const duLieuDaLuu = JSON.parse(duLieuCu);

    return {
      ...trangThaiBanDau,
      ...duLieuDaLuu,
      nangCap: duLieuDaLuu.nangCap || {},
      thanhTich: duLieuDaLuu.thanhTich || {},
    };
  } catch {
    return {
      ...trangThaiBanDau,
      nangCap: {},
      thanhTich: {},
    };
  }
}

function luuDuLieu() {
  localStorage.setItem("candybox-viet", JSON.stringify(duLieu));
}

function dinhDangSo(so) {
  if (so < 1000) {
    return Math.floor(so).toLocaleString("vi-VN");
  }

  if (so < 1_000_000) {
    return (so / 1000).toFixed(2).replace(".00", "") + " nghìn";
  }

  if (so < 1_000_000_000) {
    return (so / 1_000_000).toFixed(2).replace(".00", "") + " triệu";
  }

  return (so / 1_000_000_000).toFixed(2).replace(".00", "") + " tỷ";
}

function layGiaVatPham(vatPham) {
  const muc = duLieu.nangCap[vatPham.id]?.muc || 0;
  return Math.floor(vatPham.gia * Math.pow(vatPham.tangGia, muc));
}

function taoNangCap() {
  const khung = document.getElementById("danhSachNangCap");
  khung.replaceChildren();

  nangCap.forEach(vatPham => {
    const muc = duLieu.nangCap[vatPham.id]?.muc || 0;
    const gia = layGiaVatPham(vatPham);

    const nut = document.createElement("button");
    nut.disabled = duLieu.keo < gia;
    nut.textContent =
      `${vatPham.icon} ${vatPham.ten} — ` +
      `${vatPham.moTa} · Cấp ${muc} · ` +
      `${dinhDangSo(gia)} kẹo`;

    nut.addEventListener("click", () => muaNangCap(vatPham));
    khung.appendChild(nut);
  });
}

function taoThanhTich() {
  const khung = document.getElementById("luoiThanhTich");
  khung.replaceChildren();

  thanhTich.forEach(muc => {
    const daMo = duLieu.thanhTich[muc.id] === true;
    const the = document.createElement("p");

    the.textContent =
      `${daMo ? "🏆" : "🔒"} ${muc.ten} — ${muc.moTa}`;

    khung.appendChild(the);
  });
}

function muaNangCap(vatPham) {
  const gia = layGiaVatPham(vatPham);

  if (duLieu.keo < gia) {
    alert("Bạn chưa đủ kẹo.");
    return;
  }

  duLieu.keo -= gia;

  if (!duLieu.nangCap[vatPham.id]) {
    duLieu.nangCap[vatPham.id] = { muc: 0 };
  }

  duLieu.nangCap[vatPham.id].muc++;

  tinhSucManh();
  luuDuLieu();
  capNhapGiaoDien();

  alert(`Đã nâng cấp ${vatPham.ten}!`);
}

function tinhSucManh() {
  duLieu.lucNhan = 1;
  duLieu.moiGiay = 0;

  nangCap.forEach(vatPham => {
    const muc = duLieu.nangCap[vatPham.id]?.muc || 0;

    if (vatPham.id === "tay") {
      duLieu.lucNhan += muc;
    }

    if (vatPham.id === "tho") {
      duLieu.lucNhan += muc * 3;
    }

    if (vatPham.id === "may") {
      duLieu.moiGiay += muc * 2;
    }

    if (vatPham.id === "phaLe") {
      duLieu.moiGiay += muc * 12;
    }
  });
}

function nhanKeo() {
  duLieu.keo += duLieu.lucNhan;
  duLieu.tongKeo += duLieu.lucNhan;

  luuDuLieu();
  capNhapGiaoDien();
}

function kiemTraThanhTich() {
  let coThanhTichMoi = false;

  thanhTich.forEach(muc => {
    if (!duLieu.thanhTich[muc.id] && muc.dieuKien(duLieu)) {
      duLieu.thanhTich[muc.id] = true;
      coThanhTichMoi = true;
      alert(`Thành tích mới: ${muc.ten}`);
    }
  });

  if (coThanhTichMoi) {
    luuDuLieu();
  }
}

function capNhapGiaoDien() {
  document.getElementById("soKeo").textContent =
    dinhDangSo(duLieu.keo);

  document.getElementById("lucNhan").textContent =
    dinhDangSo(duLieu.lucNhan);

  document.getElementById("lucMoiGiay").textContent =
    dinhDangSo(duLieu.moiGiay);

  taoNangCap();
  taoThanhTich();
  kiemTraThanhTich();
}

document.getElementById("nutKeo").addEventListener("click", nhanKeo);

document.getElementById("nutReset").addEventListener("click", () => {
  const dongY = confirm("Ngươi chắc chắn muốn xóa toàn bộ tiến trình?");

  if (!dongY) {
    return;
  }

  duLieu = {
    ...trangThaiBanDau,
    nangCap: {},
    thanhTich: {},
  };

  localStorage.removeItem("candybox-viet");

  tinhSucManh();
  luuDuLieu();
  capNhapGiaoDien();

  alert("Đã khởi đầu một hành trình mới!");
});

setInterval(() => {
  if (duLieu.moiGiay > 0) {
    duLieu.keo += duLieu.moiGiay;
    duLieu.tongKeo += duLieu.moiGiay;
  }

  luuDuLieu();
  capNhapGiaoDien();
}, 1000);

tinhSucManh();
capNhapGiaoDien();