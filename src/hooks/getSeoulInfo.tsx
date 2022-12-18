import { xml2js } from "xml-js";
import axios from "axios";
import {
  NewsStatus,
  PopulationType,
  WeatherStatus,
} from "../props/populationType";

const key = process.env.REACT_APP_API_KEY_SEOUL;

const getSeoulInfo = async (place: string): Promise<PopulationType> => {
  const { data } = await axios({
    method: "get",
    url: `http://openapi.seoul.go.kr:8088/${key}/xml/citydata/1/5/${place}`,
  });

  const element = xml2js(data);
  console.log(
    element.elements[0].elements[2].elements[8].elements[0].elements[25]
      .elements[0].elements[0].elements[0].text
  );

  const popData: PopulationType = {
    area_name: element.elements[0].elements[2].elements[0].elements[0].text,
    cong_status: {
      level:
        element.elements[0].elements[2].elements[1].elements[0].elements[0]
          .elements[0].text,
      message:
        element.elements[0].elements[2].elements[1].elements[0].elements[1]
          .elements[0].text,
      min: element.elements[0].elements[2].elements[1].elements[0].elements[2]
        .elements[0].text,
      max: element.elements[0].elements[2].elements[1].elements[0].elements[3]
        .elements[0].text,
      time: element.elements[0].elements[2].elements[1].elements[0].elements[17]
        .elements[0].text,
    },
    traffic_status: {
      avg: {
        message:
          element.elements[0].elements[2].elements[2].elements[0].elements[0]
            .elements[0].text,
        level:
          element.elements[0].elements[2].elements[2].elements[0].elements[1]
            .elements[0].text,
      },
      roads: element.elements[0].elements[2].elements[2].elements
        .slice(1, -1)
        .map((el: any) => ({
          name: el.elements[1].elements[0].text,
          dist: el.elements[8].elements[0].text,
          speed: el.elements[9].elements[0].text,
          level: el.elements[10].elements[0].text,
        })),
    },
    news: element.elements[0].elements[2].elements[8].elements[0].elements[25].elements.map(
      (el: any): NewsStatus => ({
        warn_val: el.elements[0].elements[0].text,
        warn_stress: el.elements[1].elements[0].text,
        time: el.elements[2].elements[0].text,
        command: el.elements[3].elements[0].text,
        warn_msg: el.elements[5].elements[0].text,
      })
    ),
    weather: element.elements[0].elements[2].elements[8].elements.map(
      (el: any): WeatherStatus => ({
        temp: el.elements[1].elements[0].text,
        sensibe_temp: el.elements[2].elements[0].text,
        max_temp: el.elements[3].elements[0].text,
        min_temp: el.elements[4].elements[0].text,
        pcp: el.elements[8].elements[0].text,
        pcp_type: el.elements[9].elements[0].text,
        pcp_msg: el.elements[10].elements[0].text,
      })
    )[0],
  };
  return popData;
};

export default getSeoulInfo;
