"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosClientWithAuth } from "@/libs/axiosClient";
import ModalDelete from "@/components/ModalDelete";
import { truncateWords } from "@/utils/utils";
import ModalPegawai from "@/components/ModalPegawai";
import AddModal from "@/components/AddModal";

interface ListCuti {
  alasan: string;
  id: number;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface PegawaiData {
  id: number;
  namaDepan: string;
  namaBelakang: string;
  email: string;
  alamat: string;
  noHp: string;
  jenisKelamin: "pria" | "perempuan";
  cuti: ListCuti[];
}

const Pegawai = () => {
  const [data, setData] = useState<PegawaiData[]>([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [totalData, setTotalData] = useState(0); // total data dari server (jika API sediakan)

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const client = axiosClientWithAuth();
        const res = await client.get(`/pegawai?limit=${limit}&page=${page}`);
        setData(res.data.data);
        if (res.data.total) {
          setTotalData(res.data.total);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [limit, page, refreshToggle]);

  const totalPages = Math.ceil(totalData / limit);

  const goToPage = (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="limitSelect" className="font-semibold">
            Show:
          </label>
          <select
            id="limitSelect"
            className="select select-bordered w-24"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 15, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div>
          <AddModal
            modalTitle="Tambah Admin Baru"
            onSuccess={() => setRefreshToggle((prev) => !prev)}
            params="pegawai"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>No Hp</th>
              <th>Tanggal Cuti</th>
              <th>Alamat</th>
              <th className="text-center">Jenis Kelamin</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((staff, index) => (
                <tr className="hover:bg-gray-100" key={staff.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>
                    <div className="font-bold">
                      {staff.namaDepan} {staff.namaBelakang}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {staff.email}
                    </span>
                  </td>
                  <td>{staff.noHp}</td>
                  <td width={"100px"}>
                    <div className="flex flex-wrap gap-2 items-center">
                      {staff.cuti.map((cuti) => (
                        <div
                          key={cuti.id}
                          className="badge badge-ghost badge-sm p-2"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            columnGap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          <span className="whitespace-nowrap font-bold">
                            {cuti.tanggalMulai}
                          </span>
                          <span className="whitespace-nowrap">sampai</span>
                          <span className="whitespace-nowrap font-bold">
                            {cuti.tanggalSelesai}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs">{truncateWords(staff.alamat, 25)}</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center gap-3">
                      {staff.jenisKelamin === "pria" ? (
                        <Image
                          src="male.svg"
                          alt="male icon"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <Image
                          src="female.svg"
                          alt="female icon"
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center items-center gap-3">
                      <ModalPegawai
                        modalTitle="Detail Pegawai"
                        modalId={staff.id}
                        data={staff}
                        onSuccess={() => setRefreshToggle((prev) => !prev)}
                      />
                      <ModalDelete
                        modalId={staff.id}
                        nama={staff.namaDepan + " " + staff.namaBelakang}
                        onSuccess={() => setRefreshToggle((prev) => !prev)}
                        params="pegawai"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {page} of {totalPages || 1}
        </div>
        <div className="btn-group">
          <button
            className="btn btn-outline"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="btn btn-outline ml-2"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Pegawai;
