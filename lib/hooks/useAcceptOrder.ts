import { useMutation } from "@apollo/client";
import { ACCEPT_ORDER } from "../api/graphql";

export default function useAcceptOrder() {
  const [mutateAccept, { loading, error }] = useMutation(ACCEPT_ORDER);

  const acceptOrderFunc = async (_id: string, time: string) => {
    console.log("🟡 [AcceptOrder] Bắt đầu gửi mutation với dữ liệu:", { _id, time });
    try {
      const response = await mutateAccept({ variables: { _id, time } });
      console.log("🟢 [AcceptOrder] Thành công:", response.data);
      return response.data;
    } catch (err) {
      console.error("🔴 [AcceptOrder] Lỗi khi gửi mutation:", err);
      throw err;
    }
  };

  if (error) {
    console.error("⚠️ [AcceptOrder] Lỗi Apollo Client:", error);
  }

  return { loading, error, acceptOrder: acceptOrderFunc };
}
