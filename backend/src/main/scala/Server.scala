import com.typesafe.scalalogging.LazyLogging

object Server extends cask.MainRoutes with LazyLogging {

  override def port: Int = 8082

  @cask.get("/")
  def hello() = {
    "Hello World!"
  }

  @cask.get("/sample-data")
  def sample(): String = {
    logger.info("sample")
    HiveQueryRunner.sample("*", None, 20)
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
    val res = HiveQueryRunner.runQuery(select, where, groupBy, None)
    cask.Response(res, headers = Seq(("Access-Control-Allow-Origin", "*")))
  }

  @cask.post("/run-sample")
  def runSample(request: cask.Request): cask.Response[String] = {
    logger.info(request.text())
    val js = ujson.read(request.text())
    val select = js.obj.get("select").map(_.str).getOrElse("*")
    val where = js.obj.get("where").map(_.str)
    val limit =  js.obj.get("limit").map(_.str.toLong).getOrElse(20L)
    val res = HiveQueryRunner.sample(select, where, limit)
    cask.Response(res, headers = Seq(("Access-Control-Allow-Origin", "*")))
  }

  initialize()
}
