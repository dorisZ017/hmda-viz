import org.jooq.impl.DSL

import java.sql.{Connection, DriverManager}

object HiveQueryRunner {
  val prefix = "spark_catalog.default.t1"
  val connStr = "jdbc:hive2://localhost:10000"
  lazy val connection: Connection = DriverManager.getConnection(connStr, "", "")

  def runQuery(select: String, where: Option[String], groupBy: Option[String]): String = {
    val whereClause = where.map(x => s"where $x").getOrElse("")
    val groupByClause = groupBy.map(x => s"group by $x").getOrElse("")
    val sql = s"select $select from $prefix $whereClause $groupByClause"
    DSL.using(connection).fetch(sql).formatJSON()
  }
}
