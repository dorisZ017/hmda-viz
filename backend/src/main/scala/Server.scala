import com.typesafe.scalalogging.LazyLogging

object Server extends cask.MainRoutes with LazyLogging {
  @cask.get("/")
  def hello() = {
    "Hello World!"
  }

  @cask.get("/sample-data")
  def sample(): String = {
    logger.info("sample")
    HiveQueryRunnerSample.getSample
  }

  @cask.post("/run-query")
  def jsonEndpoint(request: cask.Request): cask.Response[String] = {
    logger.info(request.text())
    val js = ujson.read(request.text())
    val select = js.obj.get("select").map(_.str) match {
      case None => return cask.Abort(500)
      case Some(s) => s
    }
    val where = js.obj.get("where").map(_.str)
    val groupBy = js.obj.get("groupby").map(_.str)
    val res = HiveQueryRunnerSample.runQuery(select, where, groupBy)
    cask.Response(res, headers = Seq(("Access-Control-Allow-Origin", "*")))
  }

  initialize()
}
