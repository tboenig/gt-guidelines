<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    exclude-result-prefixes="xs" version="3.0">
    <xsl:output method="xml"/>

    
    <xsl:template match="topic">
        <xsl:apply-templates/>
    </xsl:template>


    <xsl:template match="entry">
        <xsl:for-each select="codeph[@props = 'XPath']">

            <xsl:element name="xsl:template">
                <xsl:attribute name="match">
                    <xsl:value-of select="."/>
                </xsl:attribute>
            </xsl:element>
        </xsl:for-each>
    </xsl:template>





    <xsl:template match="title | thead | prodname"/>

</xsl:stylesheet>
