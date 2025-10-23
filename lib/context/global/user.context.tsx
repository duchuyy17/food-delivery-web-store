import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { requestForegroundPermissionsAsync } from "expo-location";
import { QueryResult, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Interface
import {
  IStoreProfileResponse,
  IUserContextProps,
  IUserProviderProps,
} from "@/lib/utils/interfaces";

// API
import { STORE_PROFILE } from "@/lib/apollo/queries";
import {
  IStoreEarnings,
  IStoreEarningsArray,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Services
import { asyncStorageEmitter } from "@/lib/services";

const UserContext = createContext<IUserContextProps>({} as IUserContextProps);

export const UserProvider = ({ children }: IUserProviderProps) => {
  const [modalVisible, setModalVisible] = useState<
    IStoreEarnings & { bool: boolean }
  >({
    bool: false,
    _id: "",
    date: "",
    earningsArray: [] as IStoreEarningsArray[],
    totalEarningsSum: 0,
    totalDeliveries: 0,
    totalOrderAmount: 0,
  });

  const [userId, setUserId] = useState("");
  const [storeOrdersEarnings, setStoreOrderEarnings] = useState<
    IStoreEarningsArray[] | null
  >(null);

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfile,
  } = useQuery(STORE_PROFILE, {
    fetchPolicy: "network-only",
    variables: {
      restaurantId: userId,
    },
    onCompleted: (data) => {
      console.log(
        "✅ STORE_PROFILE API completed:",
        JSON.stringify(data, null, 2)
      );
    },
    onError: (error) => {
      console.log(
        "❌ STORE_PROFILE API error:",
        error.message,
        "\nrestaurantId:",
        userId
      );
    },
  }) as QueryResult<IStoreProfileResponse | undefined, { restaurantId: string }>;

  // Lấy userId từ AsyncStorage
  const getUserId = useCallback(async () => {
    const id = await AsyncStorage.getItem("store-id");
    console.log("📦 store-id trong AsyncStorage:", id);
    if (id) {
      setUserId(id);
    } else {
      console.warn("⚠️ Không tìm thấy store-id trong AsyncStorage!");
    }
  }, []);

  // Lắng nghe thay đổi store-id
  useEffect(() => {
    const listener = asyncStorageEmitter.addListener("store-id", (data: any) => {
      console.log("🔄 asyncStorageEmitter thay đổi store-id:", data);
      setUserId(data?.value ?? "");
    });

    getUserId();

    return () => {
      if (listener) listener.removeListener();
    };
  }, []);

  // Khi userId thay đổi → refetch API
  useEffect(() => {
    if (userId) {
      console.log("🚀 Gọi lại STORE_PROFILE với restaurantId:", userId);
      refetchProfile({ restaurantId: userId });
    } else {
      console.log("⚠️ userId rỗng, không gọi STORE_PROFILE");
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        modalVisible,
        setModalVisible,
        userId,
        loadingProfile,
        errorProfile,
        dataProfile: dataProfile?.restaurant ?? null,
        requestForegroundPermissionsAsync,
        setStoreOrderEarnings,
        storeOrdersEarnings,
        refetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
export const useUserContext = () => useContext(UserContext);
export default UserContext;
