package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_label", schema = "gtd", catalog = "")
public class GtdLabelEntity {
    private int id;
    private String labelName;
    private String labelType;
    private String labelTable;
    private String labelColor;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp column9;

    @Id
    @Column(name = "ID")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "LABEL_NAME")
    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }

    @Basic
    @Column(name = "LABEL_TYPE")
    public String getLabelType() {
        return labelType;
    }

    public void setLabelType(String labelType) {
        this.labelType = labelType;
    }

    @Basic
    @Column(name = "LABEL_TABLE")
    public String getLabelTable() {
        return labelTable;
    }

    public void setLabelTable(String labelTable) {
        this.labelTable = labelTable;
    }

    @Basic
    @Column(name = "LABEL_COLOR")
    public String getLabelColor() {
        return labelColor;
    }

    public void setLabelColor(String labelColor) {
        this.labelColor = labelColor;
    }

    @Basic
    @Column(name = "CREATE_ID")
    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    @Basic
    @Column(name = "CREATE_DATE")
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "UPDATE_ID")
    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
        this.updateId = updateId;
    }

    @Basic
    @Column(name = "column_9")
    public Timestamp getColumn9() {
        return column9;
    }

    public void setColumn9(Timestamp column9) {
        this.column9 = column9;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdLabelEntity that = (GtdLabelEntity) o;
        return id == that.id &&
                Objects.equals(labelName, that.labelName) &&
                Objects.equals(labelType, that.labelType) &&
                Objects.equals(labelTable, that.labelTable) &&
                Objects.equals(labelColor, that.labelColor) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(column9, that.column9);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, labelName, labelType, labelTable, labelColor, createId, createDate, updateId, column9);
    }
}
