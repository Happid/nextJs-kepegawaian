"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosClientWithAuth } from "@/libs/axiosClient";
import Modal from "@/components/Modal";
import ModalDelete from "@/components/ModalDelete";
import AddModal from "@/components/AddModal";

interface AdminStaff {
  id: number;
  namaDepan: string;
  namaBelakang: string;
  email: string;
  tanggalLahir: string;
  jenisKelamin: "pria" | "perempuan";
}

const Admin = () => {
  const [data, setData] = useState<AdminStaff[]>([]);
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
        const res = await client.get(`/admin?limit=${limit}&page=${page}`);
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
            params="admin"
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
              <th>Tanggal Lahir</th>
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
              data.map((admin, index) => (
                <tr className="hover:bg-gray-100" key={admin.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>
                    <div className="font-bold">
                      {admin.namaDepan} {admin.namaBelakang}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {admin.email}
                    </span>
                  </td>
                  <td>{admin.tanggalLahir}</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center gap-3">
                      {admin.jenisKelamin === "pria" ? (
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
                      <Modal
                        modalTitle="Detail Admin"
                        modalId={admin.id}
                        data={admin}
                        onSuccess={() => setRefreshToggle((prev) => !prev)}
                      />
                      <ModalDelete
                        modalId={admin.id}
                        nama={admin.namaDepan + " " + admin.namaBelakang}
                        onSuccess={() => setRefreshToggle((prev) => !prev)}
                        params="admin"
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

export default Admin;
