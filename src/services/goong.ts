import axios from "../customs/axios-customize";

const GoongMapService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search: (input: string): Promise<any> => {
    return axios.get(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.NEXT_PUBLIC_GOONG_KEY}&input=${input}`
    );
  },
};

export default GoongMapService;
