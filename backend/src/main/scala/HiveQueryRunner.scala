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

  def runQuery(selects: Seq[Map[String, String]], wheres: Seq[Map[String, String]], groupBys: Seq[String], limit: Option[Long]): String = {
    val sql = buildSQL(selects, wheres, groupBys, limit)
    DSL.using(connection).fetch(sql)
      .formatJSON(new JSONFormat().header(false).recordFormat(RecordFormat.OBJECT))
  }

  def buildSQL(selects: Seq[Map[String, String]], wheres: Seq[Map[String, String]], groupBys: Seq[String], limit: Option[Long]): String = {
    val groupsField = if (groupBys.nonEmpty) {
      s"CONCAT_WS('-', ${groupBys.mkString(", ")}) AS `${groupBys.mkString("-")}`, "
    } else ""
    val selectClause = "SELECT " + groupsField + selects.map { s =>
      val col = s.get("col").getOrElse(throw new IllegalArgumentException("misformatted select"))
      val funcName = s.get("operator")
      val funcCol = funcName.map(f => s"$f($col)").getOrElse(col)
      funcCol + s.get("alias").map(a => s" AS $a").getOrElse("")
    }.mkString(", ")
    val whereFields = wheres.map { w =>
      w.get("col").flatMap(col => w.get("predicate").map(p => s"$col $p")).getOrElse("")
    }.mkString(" AND ")
    val whereClause = if (whereFields.nonEmpty) s"WHERE $whereFields" else ""
    val groupByClause = if (groupBys.nonEmpty) s"GROUP BY ${groupBys.mkString(",")}" else ""
    val limitClause = limit.map(x => s"LIMIT $x").getOrElse("")
    s"$selectClause from $prefix $whereClause $groupByClause $limitClause"
  }

  def getSchema: String = {
    DSL.using(connection).fetch(s"select * from $prefix where 1=0")
      .formatJSON()
  }

  def sample(select: String, where: Option[String], limit: Long): String = {
    runQuery(select, where, None, Option(limit))
  }
}
