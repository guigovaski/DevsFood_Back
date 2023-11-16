import { ReturnStateDto } from '@src/state/dtos/returnState.dto';

export class ReturnCityDto {
  name: string;
  state?: ReturnStateDto;
  constructor(city) {
    this.name = city.name;
    this.state = city.state ? new ReturnStateDto(city.state) : null;
  }
}
