import com.typesafe.scalalogging.LazyLogging
import ujson.Value

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

  @cask.post("/run-query-v2")
  def runQuery(request: cask.Request): cask.Response[String] = {
    logger.info(request.text())
    val js = ujson.read(request.text())
    /*
    {
     "select":[{"col":"abc","operator":"max","alias":"a"}],
     "where":[{"col":"a","predicate":">0"}],
     "groupBy":["b"]
    }
     */
    val selects = getMapSeq(js, "select")
    val wheres = getMapSeq(js, "where")
    val groupBys = js.obj.get("groupBy").map { v =>
      v.arr.map(_.str)
    }.getOrElse(Seq())
    val limit = js.obj.get("limit").map(_.toString().toLong)
    val res = HiveQueryRunner.runQuery(selects, wheres, groupBys, limit)
    cask.Response(res, headers = Seq(("Access-Control-Allow-Origin", "*")))
  }

  private def getMapSeq(js: Value, key: String): Seq[Map[String, String]] = {
    js.obj.get(key).map(_.arr) match {
      case None => throw new IllegalArgumentException(s"${key} not found in ${js.toString()}")
      case Some(ss) => ss.map { s => s.obj.collect { case (k, v) => (k, v.str) }.toMap }
    }
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
