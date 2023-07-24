import org.jooq.JSONFormat
import org.jooq.JSONFormat.RecordFormat
import org.jooq.impl.DSL

import java.sql.DriverManager
import scala.collection.JavaConverters._

object HiveQueryRunnerSample extends App {


  def getSample: String = {
    val prefix = "spark_catalog.default.t1"
    val connStr = "jdbc:hive2://localhost:10000"
    val connection = DriverManager.getConnection(connStr, "", "")
    val statement = connection.createStatement()
    val resultSet = statement.executeQuery(s"select ${prefix}.* from t1 where $prefix.total_units > 1 limit 5")
    val js = DSL.using(connection).fetch(resultSet)
      .formatJSON(new JSONFormat().header(false).recordFormat(RecordFormat.OBJECT))
    js
  }

  def runQuery(select: String, where: Option[String], groupBy: Option[String]): String = {
    val prefix = "spark_catalog.default.t1"
    val connStr = "jdbc:hive2://localhost:10000"
    val connection = DriverManager.getConnection(connStr, "", "")
    val whereClause = where.map(x => s"where $x").getOrElse("")
    val groupByClause = groupBy.map(x => s"group by $x").getOrElse("")
    val sql = s"select $select from $prefix $whereClause $groupByClause"
    DSL.using(connection).fetch(sql)
      .formatJSON(new JSONFormat().header(false).recordFormat(RecordFormat.OBJECT))
  }

  override def main(args: Array[String]): Unit = {
    val p = runQuery("count(activity_year)", Some("census_tract is not null"), Some("purchaser_type"))
    println(p)
  }
}
