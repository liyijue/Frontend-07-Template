const BNF = `
  <MultiplicativeExpression>::=<BracketsExpression>|
    <MultiplicativeExpression>"*"<Number>|
    <MultiplicativeExpression>"/"<Number>|

  <AddtiveExpression>::=<MultiplicativeExpression>|
    <AddtiveExpression>"+"<MultiplicativeExpression>|
    <AddtiveExpression>"-"<MultiplicativeExpression>|

    <BracketsExpression>::=<Number>|"("<AddtiveExpression>")"
`
