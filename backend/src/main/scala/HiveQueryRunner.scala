import org.jooq.JSONFormat
import org.jooq.JSONFormat.RecordFormat
import org.jooq.impl.DSL

import java.sql.{Connection, DriverManager}

object HiveQueryRunner {
  val prefix = "spark_catalog.default.t1"
  val connStr = "jdbc:hive2://localhost:10000"
  lazy val connection: Connection = DriverManager.getConnection(connStr, "", "")

  def runQuery(select: String, where: Option[String], groupBy: Option[String], limit: Option[Long]): String = {
    val whereClause = where.map(x => s"where $x").getOrElse("")
    val groupByClause = groupBy.map(x => s"group by $x").getOrElse("")
    val limitClause = limit.map(x => s"limit $x").getOrElse("")
    val sql = s"select $select from $prefix $whereClause $groupByClause $limitClause"
    DSL.using(connection).fetch(sql)
      .formatJSON(new JSONFormat().header(false).recordFormat(RecordFormat.OBJECT))
  }

  def getSchema: String = {
    DSL.using(connection).fetch(s"select * from $prefix where 1=0")
      .formatJSON()
  }

  def sample(select: String, where: Option[String], limit: Long): String = {
    runQuery(select, where, None, Option(limit))
  }
}
