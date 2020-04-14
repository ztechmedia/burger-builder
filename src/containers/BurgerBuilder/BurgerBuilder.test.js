import React from "react";
import { configure, shallow } from "enzyme";
import Adapeter from "enzyme-adapter-react-16";
import { BurgerBuilder } from "./BurgerBuilder";

import BuildControls from "../../components/Burger/BuildControls/BuildControls";

configure({
  adapter: new Adapeter(),
});

describe("<BurgerBuilder />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}} />);
  });

  it("should render <BuildControls /> if receiving ingredients", () => {
    wrapper.setProps({
      ings: {
        salad: 0,
      },
    });

    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });
});
