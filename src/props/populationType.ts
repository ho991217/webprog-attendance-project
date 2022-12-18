export interface PopulationType {
  area_name: string;
  // cong_status는 Status 타입을 상속받고 min, max, time 프로퍼티를 가진다.
  cong_status: Status & {
    min: string;
    max: string;
    time: string;
  };

  traffic_status: {
    avg: Status;
    roads: [
      TrafficStatus & {
        name: string;
        level: string;
      }
    ];
  };

  weather: WeatherStatus;

  news: NewsStatus[];
}

interface Status {
  level: string;
  message: string;
}

interface TrafficStatus extends Status {
  dist: string;
  speed: string;
}

export interface WeatherStatus {
  temp: string;
  sensibe_temp: string;
  max_temp: string;
  min_temp: string;
  pcp: string;
  pcp_type: "없음" | "눈" | "비" | "진눈깨비";
  pcp_msg: string;
}

export interface NewsStatus {
  warn_val: string;
  warn_stress: string;
  time: string;
  command: string;
  warn_msg: string;
}
