import ujson.Value


case class Select(col: String, operator: String, alias: String) {
  implicit def fromJs(js: Value): Select = {
    Select(js.obj.get("select").getOrElse(""), js.obj.get("operator")
  }
}

case class Query(select: Seq[])
