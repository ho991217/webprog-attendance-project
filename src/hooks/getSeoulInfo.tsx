import { xml2js } from "xml-js";
import axios from "axios";
import { PopulationType } from "../props/populationType";

const key = process.env.REACT_APP_API_KEY_SEOUL;

const getSeoulInfo = async (place: string) => {
  const { data } = await axios({
    method: "get",
    url: `http://openapi.seoul.go.kr:8088/${key}/xml/citydata/1/5/${place}`,
  });

  const element = xml2js(data);

  const popData: PopulationType = {
    area_name: element.elements[0].elements[2].elements[0].elements[0].text,
    status: {
      area_congestion_level:
        element.elements[0].elements[2].elements[1].elements[0].elements[0]
          .elements[0].text,
      area_congestion_message:
        element.elements[0].elements[2].elements[1].elements[0].elements[1]
          .elements[0].text,
      area_population_min:
        element.elements[0].elements[2].elements[1].elements[0].elements[2]
          .elements[0].text,
      area_population_max:
        element.elements[0].elements[2].elements[1].elements[0].elements[3]
          .elements[0].text,
      time: element.elements[0].elements[2].elements[1].elements[0].elements[17]
        .elements[0].text,
    },
  };
  return popData;
};

export default getSeoulInfo;
