import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Button from "../../../Components/ui/Button";
import Input from "../../../Components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
// import { setUser } from "../../store/redux/reducers/userSlice";
import { setUser } from "../../../store/redux/reducers/userSlice";
import useScreenNavigator from "../../../Hooks/useScreenNavigator";
import routes from "../../../Navigation/routes";
import "@env";
import FetchDataService from "../../../Services/FetchDataService";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { storeData, retrieveData } from "../../../Services/StorageService";
import { setClients } from "../../../store/redux/reducers/clientSlice";
import Client from "../../../Components/modals/client";
import axios from "axios";
import { setGlobalCategories } from "../../../store/redux/reducers/globalCategories";
import { setReportsTimes } from "../../../store/redux/reducers/reportsTimesSlice";
import Loader from "../../../utiles/Loader";
const LoginBox = () => {
  const [passwordShowToggle, setPasswordShowToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const { navigateToRoute } = useScreenNavigator();
  const user = useSelector((state) => state.user);
  const clients = useSelector((state) => state.clients);

  const { fetchData } = FetchDataService();
  const dispatch = useDispatch();
  const handlepasswordToggle = () => {
    setPasswordShowToggle(!passwordShowToggle);
  };

  const schema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup
      .string()
      .required("password is required")
      .min(1, "password must contain at least 6 digits"),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputsInformation = [
    {
      id: 0,
      ref: useRef(),
      name: "username",
      label: "שם משתמש / דוא״ל",
      styleInput: [{ writingDirection: "rtl", textAlign: "right" }],

      control: control,
      returnKeyType: "next",
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "flat",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        inputsInformation[1].ref.current.focus();
      },
    },
    {
      id: 1,
      ref: useRef(),
      name: "password",
      value: "password",
      label: "סיסמה",

      control: control,
      returnKeyType: "done",
      inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "flat",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
    },
  ];
  //handling the input change
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setIsSchemaValid(true);
  };
  // validate the scheme on every change of the state
  useEffect(() => {
    schema
      .validate(formData)
      .then(() => setIsSchemaValid(true))
      .catch(() => setIsSchemaValid(false));
  }, [schema]);

  //submiting the form after validation of the input
  const onSubmitForm = async () => {
    // checking if scheme is valid
    if (isSchemaValid) {
      console.log("scheme is valid");
      setIsLoading(true);
      console.log("loading...");
      //fetching the user
      const response = await fetchData(
        process.env.API_BASE_URL + "api/login.php",
        formData
      );
      console.log("response", response);
      // if success push the user && fetch client data
      if (response.success) {
        storeData("user_id", response.user_id);
        dispatch(setUser(response.user_id));
        console.log("in");
        // fetch the client data
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: response.user_id }
        );
        // console.log("responseClients:", responseClients.data[1].reports[0]);
        if (responseClients.success) {
          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients({ clients: clients }));
          // console.log("clients[Home]:", clients);

          const responseCategories = await axios.get(
            process.env.API_BASE_URL + "api/categories.php"
          );
          dispatch(setGlobalCategories(responseCategories.data.categories));
          dispatch(setReportsTimes(responseCategories.data.reports_times));
          navigateToRoute(routes.ONBOARDING.ClientsList);
          // navigateToRoute(routes.ONBOARDING.WorkerNewReport);
        } else {
          console.log("Clients Error:", responseClients.error);
          Alert.alert("Clients Error", response.error);
        }
        setIsLoading(false);
      } else {
        // if fail to fetch user data
        setIsLoading(false);
        console.log("Login error:", response.error);
        Alert.alert("Login error", response.error);
      }
      setIsLoading(false);
    }

    console.log("The form submitted:", formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ברוכים הבאים!</Text>

      {isLoading ? (
        <>
          <Text style={styles.subHeader}>אנא המתן...</Text>
          <Loader visible={isLoading} color={colors.blue} size={50} />
        </>
      ) : (
        <>
          <Text style={styles.subHeader}>הכניסו את פרטי ההתחברות</Text>

          <FlatList
            style={{ flexGrow: 0 }}
            data={inputsInformation}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(itemData) => {
              return (
                <Input
                  id={itemData.item.id}
                  proxyRef={itemData.item.ref}
                  control={itemData.item.control}
                  name={itemData.item.name}
                  label={itemData.item.label}
                  mode={itemData.item.mode}
                  inputIcon={itemData.item.inputIcon}
                  contentStyle={itemData.item.contentStyle}
                  // value={itemData.item.value}
                  secureTextEntry={itemData.item.secureTextEntry}
                  returnKeyType={itemData.item.returnKeyType}
                  underlineColor={itemData.item.underlineColor}
                  inputStyle={itemData.item.inputStyle}
                  activeUnderlineColor={itemData.item.activeUnderlineColor}
                  onChangeFunction={(value) =>
                    handleInputChange(itemData.item.name, value)
                  }
                  onSubmitEditing={itemData.item.onSubmitEditing}
                />
              );
            }}
          />
          <Button
            buttonText={"התחברות"}
            buttonFunction={handleSubmit(onSubmitForm)}
            buttonStyle={styles.button}
            buttonTextStyle={styles.buttonText}
            disableLogic={!isSchemaValid}
          />
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 500,
    height: 464,
    paddingVertical: 60,
    paddingHorizontal: 65,
  },
  header: {
    fontFamily: fonts.AExtraBold,
    fontSize: 25,
  },
  subHeader: {
    fontFamily: fonts.AMedium,
    fontSize: 25,
    marginBottom: 46,
  },
  inputContentStyling: { backgroundColor: "white" },
  inputStyling: { minWidth: "100%", backgroundColor: "white" },
  button: {
    backgroundColor: colors.red,
    borderRadius: 8,
    padding: 17,
    borderRadius: 100,
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: colors.white,
    textAlign: "center",
    width: "100%",
  },
});

export default LoginBox;
