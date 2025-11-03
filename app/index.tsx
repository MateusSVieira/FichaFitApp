import { Text, View } from "react-native";
//import { TouchableOpacity} from 'react-native';
import LoginScreen from "./(auth)/Login";

export default function Index() {
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
    >
      {/* <Text className="text-xl font-bold text-green-500">Olá teste</Text>
          <TouchableOpacity className="bg-red-600 rounded-2xl py-3 px-6 active:opacity-80">
      <Text className="text-white text-base font-semibold">Clique aqui</Text>
    </TouchableOpacity> */}
      <LoginScreen />
    </View>
  );
}
